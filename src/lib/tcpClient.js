/* eslint-disable lines-between-class-members */
import net from 'net';
import { log } from '#src/lib/log';

class TCPClient extends net.Socket {
  #host = '127.0.0.1';
  #port = 7070;

  constructor({ host, port }) {
    super();
    this.#host = host;
    this.#port = port;
  }

  start() {
    log.title(`trying to connect to ${this.#host}:${this.#port}`);
    this.connect(this.#port, this.#host, () => {
      log.info('connected');
      log.info('send a message');
      this.write(`Hello From Client ${this.address().address}`);
    });
    return this;
  }
}

export default TCPClient;
export { TCPClient };
