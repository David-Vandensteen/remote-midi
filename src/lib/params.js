import arg from 'arg';

const { log } = console;

export default class Params {
  constructor() {
    this.args = arg({
      '--id': Number,
      '--list': Boolean,
      '--version': Boolean,
      '--help': Boolean,
      '--mode': String,
      '--host': String,
      '--port': Number,

      // Aliases
      '-i': '--id',
      '-l': '--list',
      '-h': '--help',
      '-m': '--mode',
      '-p': '--port',
    });
    if (process.argv.length <= 1) Params.help();
  }

  static help() {
    log('');
    log('');
    log('remote-midi', '[options]');
    log('');
    log('     Required options:');
    log('');
    log('   -i    --id                  -- midi interface id');
    log('   -m    --mode                -- server or client');
    log('   -p    --port                -- TCP port');
    log('   --host                      -- host ip');
    log('');
    log('     Extra options:');
    log('');
    log('   --list     -l               -- show available midi interfaces');
    log('   --version                   -- show version');
    log('   --help     -h               -- show help');
    process.exit(0);
  }

  get id() { return this.args['--id']; }

  get list() { return this.args['--list']; }

  get version() { return this.args['--version']; }

  get help() { return this.args['--help']; }

  get mode() { return this.args['--mode']; }

  get host() { return this.args['--host']; }

  get port() { return this.args['--port']; }
}
