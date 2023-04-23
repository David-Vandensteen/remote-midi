import { TCPMessage } from '#src/lib/tcpMessage';
import { expect } from 'chai';
import mocha from 'mocha';

const { describe, it } = mocha;

describe('TCPMessage', () => {
  describe('#decode', () => {
    it('should decode a JSON buffer with two messages', () => {
      const buffer = Buffer.from('[[{"id":1},{"id":2}]]');
      const result = TCPMessage.decode(buffer);
      expect(result).to.deep.equal([[{ id: 1 }, { id: 2 }]]);
    });

    it('should decode a JSON buffer with one message', () => {
      const buffer = Buffer.from('[[{"id":1}]]');
      const result = TCPMessage.decode(buffer);
      expect(result).to.deep.equal([[{ id: 1 }]]);
    });
  });

  describe('#encode', () => {
    it('should encode an object into a JSON buffer', () => {
      const message = { id: 1 };
      const result = TCPMessage.encode(message);
      expect(result).to.equal('[{"id":1}]');
    });
  });
});
