import { RemoteMidi } from '#src/index';

const server = new RemoteMidi(
  '0.0.0.0',
  7070,
  'server',
  {
    midiOutputDeviceName: process.env.MIDI_OUT,
    midiInputDeviceName: process.env.MIDI_IN,
  },
);

server.start();
