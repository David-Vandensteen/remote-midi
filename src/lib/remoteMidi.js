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

  constructor({
    host, port, midiOutputDeviceName, midiInputDeviceName, mode,
  }) {
    super();
    this.#host = host;
    this.#port = port;
    this.#mode = mode;
    this.#events = RemoteMidi.getMidiEventList();
    this.#spinnies = new Spinnies();
    if (midiOutputDeviceName) this.#midiOutputDeviceName = midiOutputDeviceName;
    if (midiInputDeviceName) this.#midiInputDeviceName = midiInputDeviceName;
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
    this.#spinnies.add('remote midi server is listening');
    log.info('available output midi devices :', easymidi.getOutputs().toString());
    log.info('selected output midi device name:', this.#midiOutputDeviceName);
    log.info('selected input midi device name:', this.#midiInputDeviceName);

    this.#midiOutput = new easymidi.Output(this.#midiOutputDeviceName);
    if (this.#midiInputDeviceName) this.#midiInput = new easymidi.Input(this.#midiInputDeviceName);
    this.#spinnies.add('waiting data');

    const tcpServer = new TCPServer(this.#host, this.#port);
    this.#spinnies.succeed('remote midi server is listening');
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
    this.#spinnies.add('remote midi client is started');
    this.#tcpMidi = new TCPMidiClient({ host: this.#host, port: this.#port });
    this.#tcpMidi.start();
    this.#spinnies.succeed('remote midi client is started');
    this.#spinnies.add('waiting data to send');
    this.#tcpMidi.on('data', (message) => {
      log.info('received message', message.toString());
      this.emit('data', message);
    });
    return this;
  }

  registerEvents(events) {
    this.#events = events;
    return this;
  }

  send(type, message) { this.#tcpMidi.send(type, message); }

  /*
  mirror({ midiDeviceName }) {
    this.#midiDeviceName = midiDeviceName;
    // TODO :  refactor with midi device name
    this.#midiDeviceId = midiDeviceId;
    log.title(`mirror input device id ${midiDeviceId}`);
    log.info('input midi device :', easymidi.getInputs()[this.#midiDeviceId].toString());
    log.info('midi events to transport :', this.#events);

    this.#midiInput = new easymidi.Input(easymidi.getInputs()[this.#midiDeviceId].toString());
    this.#events.map(
      (eventName) => this.#midiInput.on(eventName, (message) => this.#tcpMidi.send(message)),
    );

    log('');
    return this;
  }
  */

  start() { if (this.#mode === 'server') return this.#server(); return this.#client(); }
}

/*

const rMidiClient = ({ host, port }) => new RemoteMidi({ host, port, mode: 'client' });
const rMidiServer = ({
  host,
  port,
  midiOutputDeviceName,
  midiInputDeviceName,
}) => new RemoteMidi({
  host,
  port,
  midiOutputDeviceName,
  midiInputDeviceName,
  mode: 'server',
});
*/

export {
  RemoteMidi,
  easymidi,
  getOutputs,
  getInputs,
  TCPMessage,
  MidiNormalizer,
};
