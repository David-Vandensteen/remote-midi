import EventEmitter from 'events';
import net from 'net';

class TCPServer extends EventEmitter {
  #host = '127.0.0.1';

  #port = 7070;

  #server;

  #sockets;

  constructor(host, port) {
    super();
    if (!host || !port) throw new Error('TCPServer::host or port is undefined');
    this.#host = host;
    this.#port = port;
    this.#sockets = [];
  }

  start() {
    this.#server = net.createServer();
    this.#server.listen(this.#port, this.#host, () => {
    });
    this.#server.on('connection', (sock) => {
      this.#sockets.push(sock);
      this.emit('connection', sock);
      sock.emit('connection', sock);

      sock.on('data', (data) => {
        /*
        this.#sockets.forEach((socket) => {
          sock.write(`TCP ${socket.remoteAddress}:${socket.remotePort} said ${data}\n`);
        });
        */
        this.emit('data', data);
      });

      sock.on('close', () => {
        const index = this.#sockets.findIndex(
          (o) => o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort,
        );
        if (index !== -1) this.#sockets.splice(index, 1);
      });
    });
  }

  close() {
    this.#server.close();
  }
}

export default TCPServer;
export { TCPServer };
