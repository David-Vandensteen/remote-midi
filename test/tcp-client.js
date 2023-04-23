import { TCPClient } from '#src/lib/tcpClient';

const { log, error } = console;

const host = '127.0.0.1';
const port = 7070;

try {
  const client = new TCPClient(host, port);
  log('TCPClient::start');
  client.start();
  log('TCPClient:: write data');
  client.write('debug');
} catch (err) {
  error(err);
}
