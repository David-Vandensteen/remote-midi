/* eslint-disable lines-between-class-members */
import { RemoteMidi } from '#src/lib/remote-midi';
import { TCPServer } from '#src/lib/tcpServer';
import { TCPMessage } from '#src/lib/tcpMessage';
import getEasyMidiEvents from '#src/lib/easymidi-event-list';
// import midiBinderService from '#src/service/midi-binder';
import { log } from '#src/lib/log';

export default class RemoteMidiMaster extends RemoteMidi {
  #socket;
  #binders = [];
  #node = undefined;
  #midiDevice = undefined;
  #nodes = [];

  serve() {
    this.register();
    this.spinnies.add(`master ${RemoteMidiMaster.hostname} is started`);
    // this.spinnies.add('waiting a connection to apply bind');

    getEasyMidiEvents().forEach((event) => {
      this.on(event, (message) => {
        console.log('TODO master send message', message, 'from event', event);
        if (this.#socket) this.#socket.write(TCPMessage.encode(message));
      });
    });

    // this.on('data', (message) => {
    //   if (process.env.NODE_ENV === 'dev') log.info('master received message from event emitter :', JSON.stringify(message));
    //   if (message?.header === 'announce') {
    //     log.info('slave', message.node, 'announce', message.midiDevices);
    //     this.#nodes.push({ node: message.node, midiDevices: message.midiDevices });
    //     this.#socket.write(TCPMessage.encode({ header: 'bind', bind: this.#binders }));
    //   } else {
    //     console.log('TODO master send message');
    //   }
    // });

    const tcpServer = new TCPServer(this.host, this.port);

    tcpServer.on('connection', (socket) => {
      this.spinnies.succeed('waiting a slave connection');
      this.#socket = socket;
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
}

export { RemoteMidiMaster };
