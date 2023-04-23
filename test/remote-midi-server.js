import { rMidiServer } from '#src/index';

const server = rMidiServer({
  host: '0.0.0.0', port: 7070, midiOutputDeviceName: 'Gestionnaire IAC Bus 1',
});
server.start();
