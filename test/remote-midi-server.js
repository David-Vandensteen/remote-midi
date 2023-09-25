import { RemoteMidi } from '#src/index';

const server = new RemoteMidi(
  '0.0.0.0',
  7070,
  'server',
  { midiOutputDeviceName: 'Gestionnaire IAC Bus 1' },
);

server.start();
