import { getInputs, getOutputs } from '#src/remote-midi';

const { log } = console;
log('inputs :', getInputs());
log('outputs :', getOutputs());
