# remote-midi

Remote-MIDI is a library that allows you to send MIDI messages between different computers through a TCP connection.  
It can be used in both unidirectional and bidirectional communication scenarios.  

## Unidirectional

In a unidirectional scenario, the slave computer sends MIDI messages to the master computer, which then forwards them to a MIDI out device connected to it.  
The process is represented in the following diagram:

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


On the server/master side, you can use the rMidiServer function to start a server that listens for incoming MIDI messages on a specific IP and port, and forwards them to a specific MIDI out device:
```javascript
import { rMidiServer } from '#src/remote-midi';

const server = rMidiServer({
  host: '0.0.0.0', port: 7070, midiOutputDeviceName: 'vmidi-out',
});
server.start();
```

On the client/slave side, you can use the rMidiClient function to connect to the server and send MIDI messages:
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



                                                                +----------------+
                                                                | MIDI IN DEVICE |
                                                                |                |
                                                                +----------------+
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
