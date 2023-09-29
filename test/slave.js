import { RemoteMidiSlave } from '#src/index';

new RemoteMidiSlave('192.168.0.170', 7070)
  .connect();
