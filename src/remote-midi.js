/* eslint-disable no-underscore-dangle */
/* eslint-disable lines-between-class-members */
import easymidi from 'easymidi';
import { log } from '#src/lib/log';
import { TCPServer, decode } from '#src/lib/tcpServer';
import { TCPMidi } from '#src/lib/tcpMidi';
import Spinnies from 'spinnies';

const getAllMidiEvent = () => [
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

class RemoteMidi {
  #host = '127.0.0.1';
  #port = '7070';
  #mode = 'client';
  #midiDeviceName = '';
  #midiInput;
  #midiOutput;
  #events;
  #tcpMidi;
  #spinnies;

  constructor({
    host, port, midiDeviceName, mode,
  }) {
    this.#host = host;
    this.#port = port;
    this.#mode = mode;
    this.#events = getAllMidiEvent();
    this.#spinnies = new Spinnies();
    if (midiDeviceName) this.#midiDeviceName = midiDeviceName;
  }

  #server() {
    this.#spinnies.add('remote midi server is listening');
    log.info('available output midi devices :', easymidi.getOutputs().toString());
    log.info('selected midi device name:', this.#midiDeviceName);

    this.#midiOutput = new easymidi.Output(this.#midiDeviceName);

    this.#spinnies.add('waiting data');

    const tcpServer = new TCPServer({ host: this.#host, port: this.#port });
    this.#spinnies.succeed('remote midi server is listening');
    tcpServer.on('data', (dataBuffer) => {
      log.info('received message :', dataBuffer.toString());
      log.info('send the message to midi device');

      log.info(decode(dataBuffer));

      decode(dataBuffer).map((message) => {
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
    return this;
  }

  #client() {
    this.#spinnies.add('remote midi client is started');
    this.#tcpMidi = new TCPMidi({ host: this.#host, port: this.#port });
    this.#tcpMidi.start();
    this.#spinnies.succeed('remote midi client is started');
    this.#spinnies.add('waiting data to send');
    return this;
  }

  registerEvents(events) {
    this.#events = events;
    return this;
  }

  send(type, message) { this.#tcpMidi.send(type, message); }

  mirror({ midiDeviceName }) {
    this.#midiDeviceName = midiDeviceName;
    // TODO :  refactor with midi device name
    /*
    this.#midiDeviceId = midiDeviceId;
    log.title(`mirror input device id ${midiDeviceId}`);
    log.info('input midi device :', easymidi.getInputs()[this.#midiDeviceId].toString());
    log.info('midi events to transport :', this.#events);

    this.#midiInput = new easymidi.Input(easymidi.getInputs()[this.#midiDeviceId].toString());
    this.#events.map(
      (eventName) => this.#midiInput.on(eventName, (message) => this.#tcpMidi.send(message)),
    );

    log('');
    */
    return this;
  }

  start() { if (this.#mode === 'server') return this.#server(); return this.#client(); }
}

const { getOutputs, getInputs } = easymidi;

const rMidiClient = ({ host, port }) => {
  const rMidi = new RemoteMidi({
    host, port, mode: 'client',
  });
  return rMidi;
};

const rMidiServer = ({ host, port, midiDeviceName }) => {
  const rMidi = new RemoteMidi({
    host, port, midiDeviceName, mode: 'server',
  });
  return rMidi;
};

export default RemoteMidi;
export {
  RemoteMidi,
  rMidiClient,
  rMidiServer,
  getAllMidiEvent,
  easymidi,
  getOutputs,
  getInputs,
};
