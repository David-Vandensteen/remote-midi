import { easymidi } from '#src/index';

const syncWait = (ms) => {
  const end = Date.now() + ms;
  // eslint-disable-next-line no-unused-expressions
  while (Date.now() < end) () => 0;
};

const midi = new easymidi.Output(process.env.out);

const velocity = 127;
const channel = 0;

for (let i = 100; i < 127; i += 1) {
  midi.send('noteon', {
    note: i,
    velocity,
    channel,
  });

  syncWait(200);

  midi.send('noteoff', {
    note: i,
    velocity,
    channel,
  });
}

/*
midi.send('cc', {
  controller: 40,
  value: 64,
});
*/
