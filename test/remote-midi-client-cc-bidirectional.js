import { rMidiClient } from '#src/remote-midi';

const { log } = console;
const client = rMidiClient({ host: '127.0.0.1', port: 7070 });
client
  .start()
  .on('data', () => log)
  .send('cc', {
    controller: 30,
    value: 32,
    channel: 0,
  });
