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

  static decodeString(buffer) { return buffer.toString(); }
  static decodeJSON(buffer) {
    const decodedString = TCPClient.decodeString(buffer).replaceAll('][', ',');
    return JSON.parse(decodedString);
  }

  start() {
    log.title(`trying to connect to ${this.#host}:${this.#port}`);
    this.connect(this.#port, this.#host, () => {
      log.info('connected');
    });
    return this;
  }
}

export default TCPClient;
export { TCPClient };
