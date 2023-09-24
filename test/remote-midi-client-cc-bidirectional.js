import { rMidiClient } from '#src/index';

const { log } = console;
const client = rMidiClient('127.0.0.1', 7070);
client
  .start()
  .on('data', () => log)
  .send('cc', {
    controller: 30,
    value: 32,
    channel: 0,
  });
