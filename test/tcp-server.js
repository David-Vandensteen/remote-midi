import { TCPServer } from '#src/lib/tcpServer';

const server = new TCPServer('127.0.0.1', 7070);
server.start();
