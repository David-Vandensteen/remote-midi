import { TCPClient } from '#src/lib/tcpClient';
import { TCPMessage } from '#src/lib/tcpMessage';
import { log } from '#src/lib/log';

export default class TCPMidi extends TCPClient {
  send(type, message) {
    const processMessage = message;
    // eslint-disable-next-line no-underscore-dangle
    processMessage._type = type;
    this.write(TCPMessage.encode(processMessage));
    log.debug('send data', TCPMessage.encode(processMessage));
  }
}

export { TCPMidi };
