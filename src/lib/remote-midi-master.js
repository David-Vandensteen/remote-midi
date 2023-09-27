/* eslint-disable lines-between-class-members */
import { EventEmitter } from 'events';
import easymidi from 'easymidi';
import { TCPServer } from '#src/lib/tcpServer';
import { TCPMessage } from '#src/lib/tcpMessage';
import midiBinderService from '#src/service/midi-binder';
import Spinnies from 'spinnies';
import { hostname } from 'os';
import { log } from '#src/lib/log';

export default class RemoteMidiMaster extends EventEmitter {
  #host = undefined;
  #port = undefined;
  #socket;
  #binders = [];
  #spinnies;
  #node = undefined;
  #midiDevice = undefined;
  #easyMidiIn = [];
  #easyMidiOut = [];
  #nodes = [];

  constructor(host, port) {
    super();
    if (!host) throw new Error('remoteMidiMaster::host is undefined');
    if (!port) throw new Error('remoteMidiMaster::port is undefined');
    this.#host = host;
    this.#port = port;
    this.#spinnies = new Spinnies();
    log.info('master id is :', RemoteMidiMaster.hostname);
    log.info('available output midi devices on master :', easymidi.getOutputs().toString());
    log.info('available input midi devices on master :', easymidi.getInputs().toString());
  }

  static get hostname() { return `${hostname}`; }

  bind(node, midiDevice) {
    this.#node = node;
    this.#midiDevice = midiDevice;
    return this;
  }

  to(node, midiDevice) {
    this.#binders.push({
      from: {
        node: this.#node,
        midiDevice: this.#midiDevice,
      },
      to: {
        node,
        midiDevice,
      },
    });
    log.debug(this.#binders);
    log.info('set bind from', this.#node, this.#midiDevice, 'to', node, midiDevice);
    return this;
  }

  serve() {
    this.#spinnies.add(`master ${RemoteMidiMaster.hostname} is started`);

    this.on('data', (message) => {
      log.info('master received message from event emitter :', JSON.stringify(message));
      if (message?.header === 'announce') {
        log.info('slave', message.node, 'announce', message.midiDevices);
        this.#nodes.push({ node: message.node, midiDevices: message.midiDevices });
        this.#socket.write(TCPMessage.encode({ header: 'bind', bind: this.#binders }));
      }
    });

    const tcpServer = new TCPServer(this.#host, this.#port);

    tcpServer.on('connection', (socket) => {
      this.#spinnies.succeed('waiting a slave connection');
      this.#socket = socket;
      this.#binders.forEach((binder) => {
        console.log(binder);
        if (binder.from.node === RemoteMidiMaster.hostname) {
          midiBinderService(binder.from.midiDevice, this.#socket);
        }
      });
    });

    tcpServer.on('data', (dataBuffer) => {
      log.info('master received tcp messages :', dataBuffer.toString());

      TCPMessage.decode(dataBuffer).map((message) => {
        log.info('master emit message :', JSON.stringify(message));
        this.emit('data', message);
        return message;
      });
    });

    tcpServer.start();
    this.#spinnies.succeed(`master ${RemoteMidiMaster.hostname} is started`);
    this.#spinnies.add('waiting a slave connection');
    return this;
  }
}

export { RemoteMidiMaster };
