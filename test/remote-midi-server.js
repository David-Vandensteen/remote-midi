import { rMidiServer } from '#src/index';

const server = rMidiServer('0.0.0.0', 7070, { midiOutputDeviceName: 'Gestionnaire IAC Bus 1' });
server.start();
