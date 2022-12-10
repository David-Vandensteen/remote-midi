/* eslint-disable lines-between-class-members */
import EventEmitter from 'events';
import easymidi from 'easymidi';
import { log } from '#src/lib/log';
import { TCPServer } from '#src/lib/tcpServer';
import { TCPClient } from '#src/lib/tcpClient';

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

class RemoteMidi extends EventEmitter {
  #host = '127.0.0.1';
  #port = '7070';
  #mode = 'client';
  #midiDeviceId = 0;
  #midiInput;
  #midiOutput;
  #events;

  constructor({
    host, port, midiDeviceId, mode,
  }) {
    super();
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

    log.info(`trying to send a midi message to device ${this.#midiDeviceId} -> ${easymidi.getOutputs()[this.#midiDeviceId].toString()}`);
    log('');
    this.#midiOutput.send('cc', {
      controller: 37,
      value: 80,
      channel: 0,
    });

    const tcpServer = new TCPServer({ host: this.#host, port: this.#port });
    tcpServer.on('data', (dataBuffer) => {
      log.info('received message :', dataBuffer.toString());
      this.emit('data', dataBuffer);
    });
    tcpServer.start();
  }

  #client() {
    log.title('starting remote midi client');
    log.info('input midi device :', easymidi.getInputs(this.#midiDeviceId).toString());
    log.info('midi events to transport :', this.#events);

    this.#midiInput = new easymidi.Input(easymidi.getInputs(this.#midiDeviceId).toString());

    this.#events.map((eventName) => this.#midiInput.on(eventName, () => log(eventName)));

    log('');
    const tcpClient = new TCPClient({ host: this.#host, port: this.#port });
    tcpClient.start();
  }

  registerEvents(events) {
    this.#events = events;
    return this;
  }

  start() { if (this.#mode === 'server') this.#server(); else this.#client(); }
}

function rMidiClient({ host, port, midiDeviceId }) {
  const rMidi = new RemoteMidi({
    host, port, midiDeviceId, mode: 'client',
  });
  return rMidi;
}

function rMidiServer({ host, port, midiDeviceId }) {
  const rMidi = new RemoteMidi({
    host, port, midiDeviceId, mode: 'server',
  });
  return rMidi;
}

export default RemoteMidi;
export { rMidiClient, rMidiServer, getAllMidiEvent };
