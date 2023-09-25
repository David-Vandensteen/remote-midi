import { RemoteMidi, TCPMessage } from '#src/index';

const { log } = console;

const client = new RemoteMidi('127.0.0.1', 7070, 'client');

client.on('data', (message) => { log('received data from midi server', TCPMessage.decode(message)); });
client.start();
