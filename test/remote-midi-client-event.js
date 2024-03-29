import { rMidiClient, TCPMessage } from '#src/index';

const { log } = console;

const client = rMidiClient({ host: '127.0.0.1', port: 7070 });

client.on('data', (message) => { log('received data from midi server', TCPMessage.decode(message)); });
client.start();
