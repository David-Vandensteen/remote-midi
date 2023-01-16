import net from 'net';
import Spinnies from 'spinnies';

export default class TCPClient extends net.Socket {
  #host = '127.0.0.1';

  #port = 7070;

  #spinnies;

  constructor({ host, port }) {
    super();
    this.#host = host;
    this.#port = port;
    this.#spinnies = new Spinnies();
    this.#spinnies.add('connected');
  }

  start() {
    this.connect(this.#port, this.#host, () => { this.#spinnies.succeed('connected'); });
    return this;
  }
}

export { TCPClient };
