const encode = (message) => JSON.stringify([message]);
const decode = (bufferMessages) => {
  const messages = JSON.parse(bufferMessages.toString().replaceAll('][', ','));
  return messages;
};

export default encode;
export { encode, decode };
