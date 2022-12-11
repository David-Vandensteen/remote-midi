/* eslint-disable lines-between-class-members */
import easymidi from 'easymidi';
import { log } from '#src/lib/log';
import { TCPServer } from '#src/lib/tcpServer';
import { TCPMidi } from '#src/lib/tcpMidi';

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
  #midiDeviceId = 0;
  #midiInput;
  #midiOutput;
  #events;
  #tcpMidi;

  constructor({
    host, port, midiDeviceId, mode,
  }) {
    this.#host = host;
    this.#port = port;
    this.#mode = mode;
    this.#events = getAllMidiEvent();
    if (midiDeviceId) this.#midiDeviceId = midiDeviceId;
  }

  #server() {
    log.title('starting remote midi server');
    log('');
    log.info('available output midi devices :', easymidi.getOutputs().toString());
    log.info('selected midi device id:', this.#midiDeviceId);
    log.info('selected midi device name:', easymidi.getOutputs()[this.#midiDeviceId]);

    this.#midiOutput = new easymidi.Output(easymidi.getOutputs()[this.#midiDeviceId]);

    const tcpServer = new TCPServer({ host: this.#host, port: this.#port });
    tcpServer.on('data', (dataBuffer) => {
      log.info('received messages :', dataBuffer.toString());
      log.info('send the messages to midi device');
      log.info('DEBUG decode messages', TCPMidi.decode(dataBuffer));

      TCPMidi.decode(dataBuffer)
        .map((data) => this.#midiOutput.send(data.type, data.message));
    });
    tcpServer.start();
  }

  #client() {
    log.title('starting remote midi client');
    this.#tcpMidi = new TCPMidi({ host: this.#host, port: this.#port });
    this.#tcpMidi.start();
  }

  registerEvents(events) {
    this.#events = events;
    return this;
  }

  mirror({ midiDeviceId }) {
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

  start() { if (this.#mode === 'server') this.#server(); else this.#client(); }
}

const rMidiClient = ({ host, port }) => {
  const rMidi = new RemoteMidi({
    host, port, mode: 'client',
  });
  return rMidi;
};

const rMidiServer = ({ host, port, midiDeviceId }) => {
  const rMidi = new RemoteMidi({
    host, port, midiDeviceId, mode: 'server',
  });
  return rMidi;
};

export default RemoteMidi;
export {
  RemoteMidi,
  rMidiClient,
  rMidiServer,
  getAllMidiEvent,
};
