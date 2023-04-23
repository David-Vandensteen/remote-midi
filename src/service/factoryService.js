import { RemoteMidi } from '#src/lib/remoteMidi';

export default class FactoryService {
  static rMidiClient({ host, port }) {
    return new RemoteMidi({ host, port, mode: 'client' });
  }

  static rMidiServer({
    host,
    port,
    midiOutputDeviceName,
    midiInputDeviceName,
  }) {
    return new RemoteMidi({
      host,
      port,
      midiOutputDeviceName,
      midiInputDeviceName,
      mode: 'server',
    });
  }
}

export { FactoryService };
