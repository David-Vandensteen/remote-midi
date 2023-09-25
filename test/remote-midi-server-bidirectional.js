import { RemoteMidi } from '#src/index';

const server = new RemoteMidi(
  '0.0.0.0',
  7070,
  'server',
  {
    midiOutputDeviceName: process.env.out,
    midiInputDeviceName: process.env.in,
  },
);

server.start();
