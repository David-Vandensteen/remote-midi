import { RemoteMidi } from '#src/index';

const client = new RemoteMidi('127.0.0.1', 7070);
client.repeatFromMasterToMidiDevice('Gestionnaire IAC Bus 2');
client.connect();
