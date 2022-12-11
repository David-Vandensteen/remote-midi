import { TCPMidi } from '#src/lib/tcpMidi';

const tcpMidi = new TCPMidi({ host: '127.0.0.1', port: 7070 });
tcpMidi.start();
tcpMidi.send({ test: 1 });
