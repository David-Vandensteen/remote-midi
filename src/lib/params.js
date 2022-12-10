import arg from 'arg';

const { log } = console;

export default class Params {
  constructor() {
    this.args = arg({
      '--id': Number,
      '--list': Boolean,
      '--version': Boolean,
      '--help': Boolean,

      // Aliases
      '-i': '--id',
      '-c': '--cc',
      '-v': '--value',
      '-l': '--list',
      '-h': '--help',
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
    log('');
    log('     Extra options:');
    log('');
    log('   --list     -l               -- show available midi interface');
    log('   --version                   -- show version');
    log('   --help     -h               -- show help');
    process.exit(0);
  }

  get id() {
    return this.args['--id'];
  }

  get list() {
    return this.args['--list'];
  }

  get version() {
    return this.args['--version'];
  }

  get help() {
    return this.args['--help'];
  }
}
