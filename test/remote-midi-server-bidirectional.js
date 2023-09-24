import { rMidiServer } from '#src/index';

const server = rMidiServer('0.0.0.0', 7070, { midiOutputDeviceName: process.env.out, midiInputDeviceName: process.env.in });
server.start();
