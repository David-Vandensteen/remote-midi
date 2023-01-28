import { emitKeypressEvents } from 'readline';
import { rMidiClient } from '#src/index';

const { log } = console;

const velocity = 127;
const channel = 0;
const baseNote = 96;

const client = rMidiClient({ host: '127.0.0.1', port: 7070 });
client.start();

log('press a z e r t y u i to send midi note C D E F G A B C ');

const sendNote = (midiSender, note) => {
  midiSender('noteon', {
    note,
    velocity,
    channel,
  });
  setTimeout(() => {
    midiSender('noteoff', {
      note,
      velocity,
      channel,
    });
  }, 300);
};

const keyboard = () => {
  const { stdin } = process;
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  stdin.on('keypress', (str, keypressing) => {
    if (keypressing.ctrl && keypressing.name === 'c') process.exit();
    else {
      log(keypressing);
      switch (keypressing.sequence) {
        case 'a':
          sendNote(client.send.bind(client), baseNote);
          break;

        case 'é':
          sendNote(client.send.bind(client), baseNote + 1);
          break;

        case 'z':
          sendNote(client.send.bind(client), baseNote + 2);
          break;

        case '"':
          sendNote(client.send.bind(client), baseNote + 3);
          break;

        case 'e':
          sendNote(client.send.bind(client), baseNote + 4);
          break;

        case 'r':
          sendNote(client.send.bind(client), baseNote + 5);
          break;

        case '(':
          sendNote(client.send.bind(client), baseNote + 6);
          break;

        case 't':
          sendNote(client.send.bind(client), baseNote + 7);
          break;

        case '-':
          sendNote(client.send.bind(client), baseNote + 8);
          break;

        case 'y':
          sendNote(client.send.bind(client), baseNote + 9);
          break;

        case 'è':
          sendNote(client.send.bind(client), baseNote + 10);
          break;

        case 'u':
          sendNote(client.send.bind(client), baseNote + 11);
          break;

        case 'i':
          sendNote(client.send.bind(client), baseNote + 12);
          break;

        default:
          break;
      }
    }
  });
};

keyboard();
