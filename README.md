# remote-midi

Send a MIDI message through a TCP protocol from a NodeJS application to a remote MIDI interface connected to another computer.

Server \ Master side :
```javascript
import { rMidiServer } from '#src/remote-midi';

const server = rMidiServer({
  host: '0.0.0.0', port: 7070, midiOutputDeviceName: 'vmidi-out', midiInputDeviceName: 'vmidi-in',
});
server.start();
```
