/* eslint-disable no-underscore-dangle */
import { TCPClient, encode } from '#src/lib/tcpClient';
import { log } from '#src/lib/log';

class TCPMidi extends TCPClient {
  send(type, message) {
    const processMessage = message;
    processMessage._type = type;
    this.write(encode(processMessage));
    log.debug('send data', encode(processMessage));
  }
}

export default TCPMidi;
export { TCPMidi, TCPClient, encode };
