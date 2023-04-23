import { RemoteMidi } from '#src/lib/remoteMidi';

export default class FactoryService {
  static rMidiClient(host, port, options) {
    if (!host || !port) throw new Error('FactoryService::host or port is undefined');
    return new RemoteMidi(host, port, 'client', options);
  }

  static rMidiServer(host, port, options) {
    if (!host || !port) throw new Error('FactoryService::host or port is undefined');
    return new RemoteMidi(host, port, 'server', options);
  }
}

export { FactoryService };
