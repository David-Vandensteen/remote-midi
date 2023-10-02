import { TCPMessage } from '#src/lib/tcpMessage';

export default (socket, midiType, midiContent) => {
  const processMessage = midiContent;
  // eslint-disable-next-line no-underscore-dangle
  processMessage._type = midiType;
  socket.write(TCPMessage.encode(processMessage));
  if (process.env.NODE_ENV === 'dev') console.log('send midi over tcp :', TCPMessage.encode(processMessage));
};
