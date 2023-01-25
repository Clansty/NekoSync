export default {
  getIP(suffix: string, mac: string) {
    const macParts = mac.split(":");
    const part1 = parseInt(macParts.shift(), 16);
    macParts.unshift((part1 ^ 2).toString(16));

    return `${suffix}:${macParts[0]}${macParts[1]}:${macParts[2]}ff:fe${macParts[3]}:${macParts[4]}${macParts[5]}`;
  },
};
