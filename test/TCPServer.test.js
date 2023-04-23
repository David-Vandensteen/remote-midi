import { assert } from 'chai';
import sinon from 'sinon';
import net from 'net';
import { TCPServer } from '#src/lib/tcpServer';
import mocha from 'mocha';

const {
  describe,
  it,
  beforeEach,
  afterEach,
} = mocha;

describe('TCPServer', () => {
  describe('start', () => {
    let server;
    let mockServer;

    beforeEach(() => {
      server = new TCPServer({ host: '127.0.0.1', port: 7070 });
      mockServer = sinon.mock(net.createServer());
    });

    afterEach(() => {
      server.removeAllListeners();
      server.send('close');
      mockServer.restore();
    });

    it('should listen on the specified host and port', (done) => {
      mockServer.expects('listen').once().withArgs(7070, '127.0.0.1', sinon.match.func);

      server.start();

      setTimeout(() => {
        mockServer.verify();
        done();
      }, 50);
    });

    it('should emit a "connection" event when a client connects', (done) => {
      const clientSocket = new net.Socket();
      const onConnectionSpy = sinon.spy();

      server.on('connection', onConnectionSpy);
      server.start();

      setTimeout(() => {
        clientSocket.connect({ port: 7070 }, () => {
          assert.isTrue(onConnectionSpy.calledOnce);
          done();
        });
      }, 50);
    });

    it('should emit a "data" event when data is received from a client', (done) => {
      const clientSocket = new net.Socket();
      const onDataSpy = sinon.spy();

      server.on('data', onDataSpy);
      server.start();

      setTimeout(() => {
        clientSocket.connect({ port: 7070 }, () => {
          clientSocket.write('hello');
        });

        setTimeout(() => {
          assert.isTrue(onDataSpy.calledOnce);
          assert.equal(onDataSpy.args[0][0].toString(), 'hello');
          done();
        }, 50);
      }, 50);
    });

    it('should remove the client socket from the internal list when the client disconnects', (done) => {
      const clientSocket = new net.Socket();

      server.start();

      setTimeout(() => {
        clientSocket.connect({ port: 7070 }, () => {
          clientSocket.destroy();
        });
      }, 50);

      setTimeout(() => {
        assert.isEmpty(server.sockets);
        done();
      }, 100);
    });
  });
});
