import { rMidiClient } from '#src/remote-midi';
import { decode } from '#src/lib/tcpMessage';

const { log } = console;

const client = rMidiClient({ host: '127.0.0.1', port: 7070 });

client.on('data', (message) => { log('received data from midi server', decode(message)); });
client.start();
