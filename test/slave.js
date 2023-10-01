import { RemoteMidiSlave } from '#src/index';

const slaveHost = process.env.MIDI_SLAVE_HOST ?? '127.0.0.1';
const slavePort = process.env.MIDI_SLAVE_PORT ?? '7070';

new RemoteMidiSlave(
  slaveHost,
  slavePort,
  {
    midi:
    { in: process.env.MIDI_IN, out: process.env.MIDI_OUT, events: ['cc'] },
  },
)
  .connect();
