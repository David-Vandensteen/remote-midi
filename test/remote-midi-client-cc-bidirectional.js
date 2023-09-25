import { RemoteMidi } from '#src/index';

const { log } = console;
const client = new RemoteMidi('127.0.0.1', 7070, 'client');
client
  .start()
  .on('data', () => log)
  .send('cc', {
    controller: 30,
    value: 32,
    channel: 0,
  });
