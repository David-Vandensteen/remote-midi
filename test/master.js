import { RemoteMidiMaster } from '#src/index';

new RemoteMidiMaster('0.0.0.0', 7070)
  .bind(RemoteMidiMaster.hostname, 'Gestionnaire IAC Bus 1')
  .to(RemoteMidiMaster.hostname, 'Gestionnaire IAC Bus 2')
  // .to('slave', 'Gestionnaire IAC Bus 2')

  .serve();
