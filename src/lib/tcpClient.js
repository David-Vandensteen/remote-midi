import net from 'net';

const { log } = console;

export default class TCPClient extends net.Socket {
  #host = '127.0.0.1';

  #port = 7070;

  constructor(host, port) {
    super();
    if (!host || !port) throw new Error('TCPClient::host or port is undefined');
    this.#host = host;
    this.#port = port;
  }

  start() {
    this.connect(this.#port, this.#host, () => { log('TCPClient::connected'); });
    return this;
  }
}

export { TCPClient };
