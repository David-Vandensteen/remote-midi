import { RemoteMidiSlave } from '#src/index';

const slaveHost = process.env.MIDI_SLAVE_HOST ?? '127.0.0.1';
const slavePort = process.env.MIDI_SLAVE_PORT ?? '7070';

new RemoteMidiSlave(
  slaveHost,
  slavePort,
  {
    midi:
    { in: process.env.MIDI_SLAVE_IN, out: process.env.MIDI_SLAVE_OUT, events: ['cc'] },
  },
)
  .connect();

// const remoteMidiSlave = new RemoteMidiSlave(
//   slaveHost,
//   slavePort,
//   {
//     midi:
//     { in: process.env.MIDI_SLAVE_IN, out: process.env.MIDI_SLAVE_OUT, events: ['cc'] },
//   },
// );

// remoteMidiSlave.on('connection', (slave) => {
//   slave.sendMidiOverTCP('cc', { controller: 37, value: 80 });
// });

// remoteMidiSlave.connect();
