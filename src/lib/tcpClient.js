/* eslint-disable lines-between-class-members */
import net from 'net';
import Spinnies from 'spinnies';

const encode = (message) => `${JSON.stringify(message)}\n`;

class TCPClient extends net.Socket {
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
    this.connect(this.#port, this.#host, () => {
      this.#spinnies.succeed('connected');
    });
    return this;
  }
}

export default TCPClient;
export { TCPClient, encode };
