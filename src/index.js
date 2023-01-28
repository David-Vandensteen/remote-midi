import { FactoryService } from '#src/service/factoryService';

import {
  RemoteMidi,
  easymidi,
  getOutputs,
  getInputs,
  TCPMessage,
  MidiNormalizer,
} from '#src/lib/remoteMidi';

const rMidiClient = ({ host, port }) => FactoryService.rMidiClient({ host, port });

const rMidiServer = ({
  host,
  port,
  midiOutputDeviceName,
  midiInputDeviceName,
}) => FactoryService.rMidiServer({
  host,
  port,
  midiOutputDeviceName,
  midiInputDeviceName,
});

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
