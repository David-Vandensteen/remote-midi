/* eslint-disable lines-between-class-members */
import { EventEmitter } from 'events';
import { hostname } from 'os';
import easymidi from 'easymidi';
import getEasyMidiEvents from '#src/lib/easymidi-event-list';
import { log } from '#src/lib/log';
import Spinnies from 'spinnies';

export default class RemoteMidi extends EventEmitter {
  host = undefined;
  port = undefined;
  midiIn = undefined;
  midiOut = undefined;
  midiInInstance;
  midiOutInstance;
  events = getEasyMidiEvents();
  spinnies;

  constructor(host, port, options) {
    super();
    if (!host) throw new Error('remoteMidiSlave::host is undefined');
    if (!port) throw new Error('remoteMidiSlave::port is undefined');
    this.host = host;
    this.port = port;

    if (options?.midi?.in) {
      this.midiIn = options.midi.in;
      this.midiInInstance = new easymidi.Input(this.midiIn);
    }

    if (options?.midi?.out) {
      this.midiOut = options.midi.out;
      this.midiOutInstance = new easymidi.Output(this.midiOut);
    }

    if (options?.midi?.events) this.events = options.midi.events;

    this.spinnies = new Spinnies();
    if (process.env.NODE_ENV === 'dev') {
      log.info('id is :', RemoteMidi.hostname);
      log.info('available output midi devices on slave :', easymidi.getOutputs().toString());
      log.info('available input midi devices on slave :', easymidi.getInputs().toString());
      if (this.midiOut) log.info('selected midiOut :', this.midiOut);
      if (this.midiIn) log.info('selected midiIn :', this.midiIn);
    }
  }

  static get hostname() { return `${hostname}`; }
}

export { RemoteMidi };
