# remote-midi

Send a MIDI message through a TCP protocol from a NodeJS application to a remote MIDI interface connected to another computer.

## Unidirectional

SLAVE COMPUTER 
  -> send a midi message over TCP to master computer host

MASTER COMPUTER receive the message 
  -> forward the midi message to midi out device connected on master computer

Server \ Master side :
```javascript
import { rMidiServer } from '#src/remote-midi';

const server = rMidiServer({
  host: '0.0.0.0', port: 7070, midiOutputDeviceName: 'vmidi-out',
});
server.start();
```

Client \ Slave side :
```javascript
import { rMidiClient } from '#src/remote-midi';

const client = rMidiClient({ host: '192.168.0.1', port: 7070 });
client
  .start()
  .send('cc', {
    controller: 30,
    value: 32,
    channel: 0,
  });
```

## Bidirectional

SLAVE COMPUTER 
  -> send a midi message over TCP to master computer host  
  -> listen midi message from master computer

MASTER COMPUTER receive the message 
  -> forward the midi message to midi out device connected on master computer  
  -> listen a midi in device and transmit messages to slave computer


Server \ Master side :
```javascript
import { rMidiServer } from '#src/remote-midi';

const server = rMidiServer({
  host: '0.0.0.0', port: 7070, midiOutputDeviceName: 'vmidi-out', midiInputDeviceName: 'vmidi-in',
});
server.start();
```

Client \ Slave side :
```javascript
import { rMidiClient } from '#src/remote-midi';

const { log } = console;
const client = rMidiClient({ host: '192.168.0.1', port: 7070 });
client
  .start()
  .on('data', () => log)
  .send('cc', {
    controller: 30,
    value: 32,
    channel: 0,
  });
```
