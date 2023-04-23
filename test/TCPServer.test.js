import { expect } from 'chai';
import sinon from 'sinon';
import assert from 'assert';
import net from 'net';
import { TCPServer } from '#src/lib/tcpServer';
import mocha from 'mocha';

const {
  describe,
  it,
  before,
  after,
  beforeEach,
  afterEach,
} = mocha;

describe('TCPServer', () => {
  let server;
  const testHost = '127.0.0.1';
  const testPort = 9999;

  before(() => {
    server = new TCPServer(testHost, testPort);
    server.start();
  });

  after(() => {
    server.close();
  });

  describe('#start', () => {
    it('should start the server and listen on the specified port', (done) => {
      const client = new net.Socket();
      client.connect(testPort, testHost, () => {
        client.destroy();
        done();
      });
    });
  });

  describe('#on', () => {
    it('should receive a "connection" event when a client connects', (done) => {
      const client = new net.Socket();
      let connectionReceveid = false;
      server.on('connection', () => {
        if (!connectionReceveid) {
          connectionReceveid = true;
          done();
        }
      });
      client.connect(testPort, testHost);
    });
  });

  describe('#data', () => {
    it('should receive a "data" event when a client sends data', (done) => {
      const client = new net.Socket();
      server.on('data', (data) => {
        expect(data.toString()).to.equal('hello');
        client.destroy();
        done();
      });
      client.connect(testPort, testHost, () => {
        client.write('hello');
      });
    });
  });
});
