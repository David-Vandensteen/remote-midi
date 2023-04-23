export default class TCPMessage {
  static decode(bufferMessages) {
    const messages = JSON.parse(bufferMessages.toString().replaceAll('][', ','));
    return messages;
  }

  static encode(message) {
    return JSON.stringify([message]);
  }
}

export { TCPMessage };
