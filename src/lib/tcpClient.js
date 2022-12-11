/* eslint-disable lines-between-class-members */
import net from 'net';
import Spinnies from 'spinnies';

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

  static decodeString(buffer) { return buffer.toString(); }
  static decodeJSON(buffer) {
    const decodedString = TCPClient.decodeString(buffer).replaceAll('][', ',');
    return JSON.parse(decodedString);
  }

  start() {
    this.connect(this.#port, this.#host, () => {
      this.#spinnies.succeed('connected');
    });
    return this;
  }
}

export default TCPClient;
export { TCPClient };
