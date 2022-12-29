import { TCPClient } from '#src/lib/tcpClient';

const client = new TCPClient({ host: '127.0.0.1', port: 7070 });
client.start();
client.write('debug');
