import { rMidiClient } from '#src/remote-midi';

const client = rMidiClient({ host: '127.0.0.1', port: 7070 });
client.start();
