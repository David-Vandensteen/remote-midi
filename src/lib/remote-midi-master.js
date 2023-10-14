/* eslint-disable lines-between-class-members */
import { RemoteMidi } from '#src/lib/remote-midi';
import { TCPServer } from '#src/lib/tcpServer';
import { TCPMessage } from '#src/lib/tcpMessage';
import easymidiTcpSender from '#src/lib/easymidi-tcp-sender';
// import midiBinderService from '#src/service/midi-binder';
import { log } from '#src/lib/log';

export default class RemoteMidiMaster extends RemoteMidi {
  #socket;
  #binders = [];
  #node = undefined;
  #midiDevice = undefined;
  #nodes = [];

  // bind(node, midiDevice, options) {
  //   this.#node = node;
  //   this.#midiDevice = midiDevice;
  //   if (options?.events) this.events = options.events;

  //   return this;
  // }

  // to(node, midiDevice) {
  //   this.#binders.push({
  //     from: {
  //       node: this.#node,
  //       midiDevice: this.#midiDevice,
  //     },
  //     events: this.events,
  //     to: {
  //       node,
  //       midiDevice,
  //     },
  //   });
  //   return this;
  // }

  serve() {
    this.register();
    this.spinnies.add(`master ${RemoteMidiMaster.hostname} is started`);
    // this.spinnies.add('waiting a connection to apply bind');

    this.on('data', (message) => {
      if (process.env.NODE_ENV === 'dev') log.info('master received message from event emitter :', JSON.stringify(message));
      if (message?.header === 'announce') {
        log.info('slave', message.node, 'announce', message.midiDevices);
        this.#nodes.push({ node: message.node, midiDevices: message.midiDevices });
        this.#socket.write(TCPMessage.encode({ header: 'bind', bind: this.#binders }));
      }
    });

    const tcpServer = new TCPServer(this.host, this.port);

    tcpServer.on('connection', (socket) => {
      this.spinnies.succeed('waiting a slave connection');
      this.#socket = socket;
      this.emit('connection', this);

      // this.#binders.forEach((binder) => {
      //   if (
      //     binder.from.node === RemoteMidiMaster.hostname
      //     && binder.to.node !== RemoteMidiMaster.hostname
      //   ) {
      //     log.info('set bind from', binder.from.node, binder.from.midiDevice, 'to', binder.to.node, binder.to.midiDevice);
      //     midiBinderService(
      //       binder.from.midiDevice,
      //       { events: binder?.events, tcpSocket: this.#socket },
      //     );
      //   }
      // });
      // this.spinnies.succeed('waiting a connection to apply bind');
    });

    tcpServer.on('data', (dataBuffer) => {
      if (process.env.NODE_ENV === 'dev') log.info('master received tcp messages :', dataBuffer.toString());

      TCPMessage.decode(dataBuffer).map((message) => {
        if (process.env.NODE_ENV === 'dev') log.info('master emit message :', JSON.stringify(message));
        this.emit('data', message);
        return message;
      });
    });

    tcpServer.start();
    this.spinnies.succeed(`master ${RemoteMidiMaster.hostname} is started`);
    this.spinnies.add('waiting a slave connection');
    return this;
  }

  sendMidiOverTCP(type, message) { easymidiTcpSender(this.#socket, type, message); }
}

export { RemoteMidiMaster };
