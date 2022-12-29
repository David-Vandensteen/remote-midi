import { rMidiClient } from '#src/remote-midi';

const client = rMidiClient({ host: '127.0.0.1', port: 7070 });

client.start()
  .send('cc', {
    controller: 40,
    value: 64,
  });

/*
client.mirror({ midiDeviceId: 2 })
  .start();
  */
