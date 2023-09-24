import { rMidiClient } from '#src/index';

const client = rMidiClient('127.0.0.1', 7070);
client
  .start()
  .send('cc', {
    controller: 30,
    value: 32,
    channel: 0,
  });
