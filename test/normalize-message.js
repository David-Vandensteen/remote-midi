import { normalizeMidiMessage } from '#src/remote-midi';

const { log } = console;

const message = {
  channel: 30,
  controller: 255,
  value: 360,
};

log('message :');
log(message);
log('');
log('normalized message :');
log(normalizeMidiMessage(message));

message.channel = -10;
message.controller = -100;
message.value = -255;

log('');
log('message');
log(message);
log('');
log('normalized message :');
log(normalizeMidiMessage(message));