import { getInputs, getOutputs } from '#src/lib/remoteMidi';

const { log } = console;
log('inputs :', getInputs());
log('outputs :', getOutputs());
