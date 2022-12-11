/* eslint-disable no-underscore-dangle */
import { TCPClient } from '#src/lib/tcpClient';
import { log } from '#src/lib/log';

class TCPMidi extends TCPClient {
  static decode(bufferMessages) {
    const decodedMessages = [];
    const messages = this.decodeJSON(bufferMessages);

    messages.map((message) => {
      const decodedMessage = { type: message._type, message };
      delete decodedMessage.message._type;
      return decodedMessages.push(decodedMessage);
    });

    return decodedMessages;
  }

  send(message) {
    this.write(JSON.stringify([message]));
    log.debug('send data', JSON.stringify([message]));
  }
}

export default TCPMidi;
export { TCPMidi, TCPClient };
