import { TCPServer } from '#src/lib/tcpServer';

const server = new TCPServer({ host: '127.0.0.1', port: 7070 });
server.start();
