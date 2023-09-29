import easymidi from 'easymidi';
import easymidiEventList from '#src/lib/easymidi-event-list';
import { TCPMessage } from '#src/lib/remoteMidi';

export default (midiFrom, options) => {
  let midiOut;
  let events = easymidiEventList();
  const midiIn = new easymidi.Input(midiFrom);

  if (options?.midiTo) midiOut = new easymidi.Output(options.midiTo);
  if (options?.events) events = options.events;

  events.forEach((event) => {
    midiIn.on(event, (message) => {
      if (process.env.NODE_ENV === 'DEV') console.log('send message', message, 'from', midiFrom);
      if (midiOut) {
        if (process.env.NODE_ENV === 'DEV') console.log('to', options.midiTo);
        midiOut.send(event, message);
      } else {
        if (process.env.NODE_ENV === 'DEV') console.log('to TCP');
        options.tcpSocket.write(TCPMessage.encode(message));
      }
    });
  });
};