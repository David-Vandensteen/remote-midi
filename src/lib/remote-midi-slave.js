/* eslint-disable no-underscore-dangle */
import { RemoteMidi } from '#src/lib/remote-midi';
import easymidi from 'easymidi';
import { TCPMidiClient } from '#src/lib/tcpMidiClient';
import { TCPMessage } from '#src/lib/tcpMessage';
import { log } from '#src/lib/log';

export default class RemoteMidiSlave extends RemoteMidi {
  #tcpMidiClient;

  connect() {
    this.register();
    this.spinnies.add(`slave ${RemoteMidiSlave.hostname} connect to master ${this.host}`);
    this.#tcpMidiClient = new TCPMidiClient(this.host, this.port);
    this.#tcpMidiClient.start();
    this.spinnies.succeed(`slave ${RemoteMidiSlave.hostname} connect to master ${this.host}`);

    this.#tcpMidiClient.on('connection', (message) => {
      log.info('slave connection message', message.toString());
    });

    this.#tcpMidiClient.on('data', (dataBuffer) => {
      if (process.env.NODE_ENV === 'dev') log.info('slave received message', dataBuffer.toString());
      TCPMessage.decode(dataBuffer).map((message) => {
        this.emit('data', message);
        if (this.midiOut && !message.header) {
          if (process.env.NODE_ENV === 'dev') log.info('received message from master : ', JSON.stringify(message), 'transmited to :', this.midiOut);
          this.midiOutInstance.send(message._type, message);
        }
        return message;
      });
    });

    if (this.midiIn) {
      this.on('data', (message) => {
        if (!message?.header) {
          this.#tcpMidiClient.write(TCPMessage.encode(message));
        }
      });
    }

    this.on('data', (message) => {
      if (process.env.NODE_ENV === 'dev') log.info('data emit received', JSON.stringify(message));
    });
    return this;
  }
}

export { RemoteMidiSlave };
