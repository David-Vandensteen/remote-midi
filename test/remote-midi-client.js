import { rMidiClient } from '#src/remote-midi';

const syncWait = (ms) => {
  const end = Date.now() + ms;
  // eslint-disable-next-line no-unused-expressions
  while (Date.now() < end) () => 0;
};

const client = rMidiClient({ host: '127.0.0.1', port: 7070 });
client.start();

const velocity = 127;
const channel = 0;

client.send('cc', {
  controller: 40,
  value: 64,
});

setInterval(() => {
  client.send('noteon', {
    note: 100,
    velocity,
    channel,
  });
}, 500);

/*

for (let i = 100; i < 127; i += 1) {
  client.send('noteon', {
    note: i,
    velocity,
    channel,
  });

  client.send('noteoff', {
    note: i,
    velocity,
    channel,
  });
}
*/
