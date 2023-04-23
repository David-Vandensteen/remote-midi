import { FactoryService } from '#src/service/factoryService';

import {
  RemoteMidi,
  easymidi,
  getOutputs,
  getInputs,
  TCPMessage,
  MidiNormalizer,
} from '#src/lib/remoteMidi';

const rMidiClient = (host, port, options) => FactoryService.rMidiClient(host, port, options);
const rMidiServer = (host, port, options) => FactoryService.rMidiServer(host, port, options);

export {
  RemoteMidi,
  rMidiClient,
  rMidiServer,
  easymidi,
  getOutputs,
  getInputs,
  TCPMessage,
  MidiNormalizer,
};
