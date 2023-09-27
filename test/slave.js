import { RemoteMidiSlave } from '#src/index';

new RemoteMidiSlave('0.0.0.0', 7070)
  .connect();
