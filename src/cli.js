import fs from 'fs-extra';
import appRootPath from 'app-root-path';
import Params from '#src/lib/params';
import easymidi from 'easymidi';
import { RemoteMidi } from '#src/index';

const { readJSONSync } = fs;
const { resolve } = appRootPath;
const { log } = console;
const { exit } = process;

const params = new Params();

if (params.help) Params.help();

if (params.version) {
  const { version } = readJSONSync(resolve('./package.json'));
  log(version);
  exit(0);
}

if (params.list) {
  log('');
  log('input interfaces :');
  easymidi.getInputs().map((input, index) => log(`${index} -> ${input}`));

  log('');
  log('output interfaces :');
  easymidi.getOutputs().map((output, index) => log(`${index} -> ${output}`));
  exit(0);
}

if (
  params.id === undefined || params.mode === undefined
) Params.help();

if (params.mode === 'server') {
  const server = new RemoteMidi(
    params.host,
    params.port,
    'server',
    { midiOutputDeviceName: params.id },
  );
  server.start();
}

if (params.mode === 'client') {
  const client = new RemoteMidi(params.host, params.port, 'client');
  client.start();
}
