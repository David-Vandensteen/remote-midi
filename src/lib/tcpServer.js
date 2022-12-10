/* eslint-disable lines-between-class-members */
import EventEmitter from 'events';
import net from 'net';
import { log } from '#src/lib/log';

class TCPServer extends EventEmitter {
  #host = '127.0.0.1';
  #port = 7070;
  #server;
  #sockets;

  constructor({ host, port }) {
    super();
    this.#host = host;
    this.#port = port;
    this.#sockets = [];
  }

  start() {
    this.#server = net.createServer();
    this.#server.listen(this.#port, this.#host, () => {
      log.title(`TCP Server is running on ${this.#host}:${this.#port}`);
      log('');
    });
    this.#server.on('connection', (sock) => {
      log.info(`TCP CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);
      this.#sockets.push(sock);

      sock.on('data', (data) => {
        log.info(`TCP DATA ${sock.remoteAddress}: ${data}`);
        this.#sockets.forEach((socket, index, array) => {
          sock.write(`TCP ${socket.remoteAddress}:${socket.remotePort} said ${data}\n`);
        });
        this.emit('data', data);
      });

      sock.on('close', () => {
        const index = this.#sockets.findIndex(
          (o) => o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort,
        );
        if (index !== -1) this.#sockets.splice(index, 1);
        log.info(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`);
      });
    });
  }
}

export default TCPServer;
export { TCPServer };
