import { TCPClient } from '#src/lib/tcpClient';
import { encode, decode } from '#src/lib/tcpMessage';
import { log } from '#src/lib/log';

class TCPMidi extends TCPClient {
  send(type, message) {
    const processMessage = message;
    // eslint-disable-next-line no-underscore-dangle
    processMessage._type = type;
    this.write(encode(processMessage));
    log.debug('send data', encode(processMessage));
  }
}

export default TCPMidi;
export {
  TCPMidi, TCPClient, encode, decode,
};
