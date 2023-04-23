import { TCPMidiClient } from '#src/lib/tcpMidiClient';
import { TCPMessage } from '#src/lib/tcpMessage';
import { expect } from 'chai';
import mocha from 'mocha';

const { describe, it } = mocha;

describe('TCPMidi', () => {
  describe('#send', () => {
    it('should send a message with the correct type', (done) => {
      const tcpMidi = new TCPMidiClient({ host: '127.0.0.1', port: 1234 });
      const message = { id: 1 };
      const expectedMessage = { _type: 'test', id: 1 };

      tcpMidi.write = (data) => {
        const result = TCPMessage.decode(data);
        expect(result).to.deep.equal([expectedMessage]);
        done();
      };

      tcpMidi.send('test', message);
      // process.exit(0);
    });
  });
});
