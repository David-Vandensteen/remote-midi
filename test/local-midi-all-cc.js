import { easymidi } from '#src/index';

const syncWait = (ms) => {
  const end = Date.now() + ms;
  // eslint-disable-next-line no-unused-expressions
  while (Date.now() < end) () => 0;
};

const midi = new easymidi.Output('server-midi');
const channel = 0;

for (let i = 0; i <= 127; i += 1) {
  const { log } = console;
  log('send 1 to cc', i, 'channel', channel);
  midi.send('cc', {
    controller: i,
    value: 1,
    channel,
  });
  syncWait(10);
}
