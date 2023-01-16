# remote-midi

Send a MIDI message through a TCP protocol from a NodeJS application to a remote MIDI interface connected to another computer.

## Unidirectional

    +----------------+     +----------------+     +----------------+
    | SLAVE COMPUTER |---->| MIDI MESSAGE   |---->| TCP            |
    |                |     |                |     |                |
    +----------------+     +----------------+     +----------------+
                                                                |
                                                                |
                                                                v
                                                          +----------------+
                                                          | MASTER COMPUTER |
                                                          |                |
                                                          +----------------+
                                                                      |
                                                                      |
                                                                      v
                                                                +----------------+
                                                                | MIDI OUT DEVICE|
                                                                |                |
                                                                +----------------+


This diagram represents the process of sending a MIDI message over TCP from a slave computer to a master computer, and then forwarding the message to a MIDI out device connected on the master computer.  
The slave computer sends the MIDI message through a MIDI protocol to a TCP protocol, which is then received by the master computer. The master computer then forwards the message through MIDI message to a MIDI out device connected to it.  

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
    +----------------+     +----------------+     +----------------+
    | SLAVE COMPUTER |---->| MIDI MESSAGE   |---->| TCP            |
    |                |     |                |     |                |
    |    rMidiClient |     |                |     |                |
    |                |     |                |     |                |
    +----------------+     +----------------+     +----------------+
                                                                |
                                                                |
                                                                v
                                                          +----------------+
                                                          | MASTER COMPUTER |
                                                          |                |
                                                          | rMidiServer    |
                                                          |                |
                                                          +----------------+
                                                                      |
                                                                      |
                                                                      v
                                                                +----------------+
                                                                | MIDI OUT DEVICE|
                                                                |                |
                                                                +----------------+
                                                                |
                                                                |
                                                                v
                                                          +----------------+
                                                          | MIDI IN DEVICE |
                                                          |                |
                                                          +----------------+
                                                                      |
                                                                      |
                                                                      v
                                                                +----------------+
                                                                | TCP            |
                                                                |                |
                                                                +----------------+
                                                                |
                                                                |
                                                                v
                                                          +----------------+
                                                          | SLAVE COMPUTER |
                                                          |                |
                                                          |    rMidiClient |
                                                          |                |
                                                          +----------------+


This diagram represents the process of sending and receiving MIDI messages between a slave computer (running rMidiClient) and a master computer (running rMidiServer) over a TCP connection.  
The slave computer sends MIDI messages to the master computer, which then uses the specified MIDI output device to send the message to a connected MIDI device.  
The master computer also listens for MIDI messages from connected MIDI in device and sends them to the slave computer.


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
