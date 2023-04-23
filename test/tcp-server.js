import { TCPServer } from '#src/lib/tcpServer';

const { log, error } = console;
const host = '127.0.0.1';
const port = 7070;

try {
  const server = new TCPServer(host, port);
  server.start();
  log('TCPServer::starting on', `${host}:${port}`);
} catch (err) {
  error(err);
}
