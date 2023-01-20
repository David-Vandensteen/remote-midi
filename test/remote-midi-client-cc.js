import { rMidiClient } from '#src/lib/remoteMidi';

const client = rMidiClient({ host: '127.0.0.1', port: 7070 });
client
  .start()
  .send('cc', {
    controller: 30,
    value: 32,
    channel: 0,
  });
