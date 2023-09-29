/* eslint-disable lines-between-class-members */
import { EventEmitter } from 'events';
import easymidi from 'easymidi';
import getEasyMidiEvents from '#src/lib/easymidi-event-list';
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
  #events = getEasyMidiEvents();
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

  bind(node, midiDevice, options) {
    this.#node = node;
    this.#midiDevice = midiDevice;
    if (options?.events) this.#events = options.events;

    return this;
  }

  to(node, midiDevice) {
    this.#binders.push({
      from: {
        node: this.#node,
        midiDevice: this.#midiDevice,
      },
      events: this.#events,
      to: {
        node,
        midiDevice,
      },
    });
    return this;
  }

  serve() {
    this.#spinnies.add(`master ${RemoteMidiMaster.hostname} is started`);
    this.#spinnies.add('waiting a connection to apply bind');

    this.on('data', (message) => {
      if (process.env.NODE_ENV === 'DEV') log.info('master received message from event emitter :', JSON.stringify(message));
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
        if (
          binder.from.node === RemoteMidiMaster.hostname
          && binder.to.node !== RemoteMidiMaster.hostname
        ) {
          log.info('set bind from', binder.from.node, binder.from.midiDevice, 'to', binder.to.node, binder.to.midiDevice);
          midiBinderService(
            binder.from.midiDevice,
            { events: binder?.events, tcpSocket: this.#socket },
          );
        }
      });
      this.#spinnies.succeed('waiting a connection to apply bind');
    });

    tcpServer.on('data', (dataBuffer) => {
      if (process.env.NODE_ENV === 'DEV') log.info('master received tcp messages :', dataBuffer.toString());

      TCPMessage.decode(dataBuffer).map((message) => {
        if (process.env.NODE_ENV === 'DEV') log.info('master emit message :', JSON.stringify(message));
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
