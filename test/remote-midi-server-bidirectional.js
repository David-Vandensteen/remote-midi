import { RemoteMidi } from '#src/index';

const server = new RemoteMidi(
  '0.0.0.0',
  7070,
  {
    midiIn: process.env.MIDI_IN,
    midiOut: process.env.MIDI_OUT,
  },
);

server.serve();
