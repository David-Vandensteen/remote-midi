/* eslint-disable lines-between-class-members */
import { EventEmitter } from 'events';
import easymidi from 'easymidi';
import { hostname } from 'os';
import { TCPMidiClient } from '#src/lib/tcpMidiClient';
import { TCPMessage } from '#src/lib/tcpMessage';
import { log } from '#src/lib/log';
import Spinnies from 'spinnies';

export default class RemoteMidiSlave extends EventEmitter {
  #host = undefined;
  #port = undefined;
  #spinnies;
  #tcpMidiClient;

  constructor(host, port) {
    super();
    if (!host) throw new Error('remoteMidiSlave::host is undefined');
    if (!port) throw new Error('remoteMidiSlave::port is undefined');
    this.#host = host;
    this.#port = port;
    this.#spinnies = new Spinnies();
    log.info('slave id is :', RemoteMidiSlave.hostname);
    log.info('available output midi devices on slave :', easymidi.getOutputs().toString());
    log.info('available input midi devices on slave :', easymidi.getInputs().toString());
  }

  static get hostname() { return `${hostname}`; }

  connect() {
    this.#spinnies.add(`slave ${RemoteMidiSlave.hostname} connect to master ${this.#host}`);
    this.#tcpMidiClient = new TCPMidiClient(this.#host, this.#port);
    this.#tcpMidiClient.start();
    this.#spinnies.succeed(`slave ${RemoteMidiSlave.hostname} connect to master ${this.#host}`);

    this.#tcpMidiClient.write(TCPMessage.encode({ header: 'announce', node: `'${RemoteMidiSlave.hostname}`, midiDevices: [] }));
    this.#tcpMidiClient.on('connection', (message) => {
      log.info('slave connection message', message.toString());
    });
    this.#tcpMidiClient.on('data', (message) => {
      log.info('slave received message', message.toString());
      this.emit('data', message.toString());
    });
    return this;
  }
}

export { RemoteMidiSlave };
