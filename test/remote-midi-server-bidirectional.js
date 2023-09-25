import { RemoteMidi } from '#src/index';

const server = new RemoteMidi(
  '0.0.0.0',
  7070,
  {
    midiOut: process.env.MIDI_OUT,
    midiIn: process.env.MIDI_IN,
  },
);

server.serve();
