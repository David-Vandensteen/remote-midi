export default class MidiNormalizer {
  static message(message) {
    const normalizedMessage = message;
    if (message?.velocity >= 127) normalizedMessage.velocity = 127;
    if (message?.velocity <= 0) normalizedMessage.velocity = 0;

    if (message?.channel >= 15) normalizedMessage.channel = 15;
    if (message?.channel <= 0) normalizedMessage.channel = 0;

    if (message?.value >= 127) normalizedMessage.value = 127;
    if (message?.value <= 0) normalizedMessage.value = 0;

    if (message?.note >= 127) normalizedMessage.note = 127;
    if (message?.note <= 0) normalizedMessage.note = 0;

    if (message?.controller >= 127) normalizedMessage.controller = 127;
    if (message?.controller <= 0) normalizedMessage.controller = 0;

    return normalizedMessage;
  }

  static controller(controller) {
    if (controller >= 127) return 127;
    if (controller <= 0) return 0;
    return controller;
  }

  static channel(channel) {
    if (channel >= 15) return 15;
    if (channel <= 0) return 0;
    return channel;
  }

  static value(value) {
    if (value >= 127) return 127;
    if (value <= 0) return 0;
    return value;
  }
}

export { MidiNormalizer };
