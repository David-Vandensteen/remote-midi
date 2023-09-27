import { RemoteMidiMaster } from '#src/index';

new RemoteMidiMaster('0.0.0.0', 7070)
  .bind(RemoteMidiMaster.hostname, process.env.MIDI_IN)
  .to('slave', 'Gestionnaire IAC Bus 1')
  .bind('slave', 'midi-test-in')
  .to('slave', 'midi-test-out')

  .bind(RemoteMidiMaster.hostname, process.env.MIDI_IN)
  .to(RemoteMidiMaster.hostname, 'Gestionnaire IAC Bus 2')

  .serve();
