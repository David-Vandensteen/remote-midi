import { TCPMidi } from '#src/lib/tcpMidi';

const tcpMidi = new TCPMidi({ host: '127.0.0.1', port: 7070 });
tcpMidi.start()
  .send('cc', {
    controller: 40,
    value: 64,
  });
