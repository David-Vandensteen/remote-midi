import { rMidiServer } from '#src/remote-midi';

const server = rMidiServer({
  host: '127.0.0.1', port: 7070, midiOutputDeviceName: 'vmidi-out', midiInputDeviceName: 'vmidi-in',
});
server.start();
