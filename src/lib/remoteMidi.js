/* eslint-disable no-underscore-dangle */
import { EventEmitter } from 'events';
import easymidi from 'easymidi';
import { log } from '#src/lib/log';
import { TCPServer } from '#src/lib/tcpServer';
import { TCPMidiClient } from '#src/lib/tcpMidiClient';
import { TCPMessage } from '#src/lib/tcpMessage';
import { MidiNormalizer } from '#src/lib/midiNormalizer';
import Spinnies from 'spinnies';

const { getOutputs, getInputs } = easymidi;

export default class RemoteMidi extends EventEmitter {
  #host = '127.0.0.1';

  #port = '7070';

  #mode = 'client';

  #midiOutputDeviceName = undefined;

  #midiInputDeviceName = undefined;

  #midiInput;

  #midiOutput;

  #events;

  #tcpMidi;

  #spinnies;

  constructor(host, port, options) {
    super();
    if (!host) throw new Error('remoteMidi::host is undefeined');
    if (!port) throw new Error('remoteMidi::port is undefined');
    this.#host = host;
    this.#port = port;
    this.#events = RemoteMidi.getMidiEventList();
    this.#spinnies = new Spinnies();
    if (options?.midiOut) this.#midiOutputDeviceName = options?.midiOut;
    if (options?.midiIn) this.#midiInputDeviceName = options?.midiIn;
  }

  static getMidiEventList = () => [
    'noteoff',
    'noteon',
    'poly aftertouch',
    'cc',
    'program',
    'channel aftertouch',
    'pitch',
    'position',
    'select',
    'clock',
    'start',
    'continue',
    'stop',
    'reset',
  ];

  #server() {
    this.#spinnies.add('remote midi master is listening');
    log.info('available output midi devices :', easymidi.getOutputs().toString());
    log.info('selected output midi device name:', this.#midiOutputDeviceName);
    log.info('selected input midi device name:', this.#midiInputDeviceName);

    this.#mode = 'master';

    this.#midiOutput = new easymidi.Output(this.#midiOutputDeviceName);
    if (this.#midiInputDeviceName) this.#midiInput = new easymidi.Input(this.#midiInputDeviceName);
    this.#spinnies.add('waiting data');

    const tcpServer = new TCPServer(this.#host, this.#port);
    this.#spinnies.succeed('remote midi master is listening');
    tcpServer.on('data', (dataBuffer) => {
      log.info('received message :', dataBuffer.toString());
      log.info('send the message to midi device', this.#midiOutputDeviceName);

      TCPMessage.decode(dataBuffer).map((message) => {
        const type = message._type;
        // eslint-disable-next-line no-param-reassign
        delete message._type;
        this.#midiOutput.send(type, message);
        log.debug('type', type);
        log.debug('message', message);
        return message;
      });
    });
    tcpServer.start();
    if (this.#midiInput) {
      tcpServer.on('connection', (socket) => {
        this.#midiInput.on('cc', (message) => {
          log.debug('send message', message);
          socket.write(TCPMessage.encode(message));
        });
      });
    }
    return this;
  }

  #client() {
    this.#mode = 'slave';
    this.#spinnies.add('remote midi slave is started');
    this.#tcpMidi = new TCPMidiClient(this.#host, this.#port);
    this.#tcpMidi.start();
    this.#spinnies.succeed('remote midi slave is started');
    this.#spinnies.add('waiting data to send');
    this.#tcpMidi.on('data', (message) => {
      log.info('received message', message.toString());
      this.emit('data', message.toString());
    });
    return this;
  }

  registerEvents(events) {
    this.#events = events;
    return this;
  }

  send(type, message) { this.#tcpMidi.send(type, message); }

  repeatFromMasterToMidiDevice(midiDevice) {
    if (this.#midiOutput === undefined) {
      this.#midiOutput = new easymidi.Output(midiDevice);
    }
    this.on('data', (jsonMidiMessage) => {
      const [midiMessage] = JSON.parse(jsonMidiMessage);
      log.info('repeat to midi device :', midiDevice, midiMessage);
      const type = midiMessage._type;
      // eslint-disable-next-line no-param-reassign
      delete midiMessage._type;
      this.#midiOutput.send(type, midiMessage);
    });
    return this;
  }

  connect() { return this.#client(); }

  serve() { return this.#server(); }
}

export {
  RemoteMidi,
  easymidi,
  getOutputs,
  getInputs,
  TCPMessage,
  MidiNormalizer,
};
