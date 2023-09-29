import { RemoteMidiMaster } from '#src/index';

const masterHost = process.env.MIDI_MASTER_HOST ?? '0.0.0.0';
const masterPort = process.env.MIDI_MASTER_PORT ?? '7070';

const bindFromHostname = process.env.MIDI_BIND_FROM_HOSTNAME ?? RemoteMidiMaster.hostname;
const bindFromDevice = process.env.MIDI_BIND_FROM_DEVICE;

const bindToHostname = process.env.MIDI_BIND_TO_HOSTNAME ?? 'UNKNOW';
const bindToDevice = process.env.MIDI_BIND_TO_DEVICE;

new RemoteMidiMaster(masterHost, masterPort)
  .bind(bindFromHostname, bindFromDevice)
  .to(bindToHostname, bindToDevice)
  .serve();
