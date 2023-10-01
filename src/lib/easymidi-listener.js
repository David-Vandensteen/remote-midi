import { EventEmitter } from 'events';

export default class EasymidiListener extends EventEmitter {
  constructor(midiInInstance, events) {
    super();
    events.forEach((event) => {
      midiInInstance.on(event, (message) => {
        this.emit('all', message);
      });
    });
  }
}

export { EasymidiListener };
