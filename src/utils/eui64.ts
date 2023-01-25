import os from "os";
import { getConfig } from "../models/config.js";
import ip6 from "ip6";

const eui64 = {
  getIP(mac: string, suffix?: string) {
    if (!suffix) suffix = eui64.getSuffix();
    const macParts = mac.split(":");
    const part1 = parseInt(macParts.shift(), 16);
    macParts.unshift((part1 ^ 2).toString(16));

    return `${suffix}:${macParts[0]}${macParts[1]}:${macParts[2]}ff:fe${macParts[3]}:${macParts[4]}${macParts[5]}`;
  },
  getSuffix() {
    const nic = os.networkInterfaces()[getConfig().nic];
    const firstV6 = nic.find((it) => it.family === "IPv6");
    const normalize: string = ip6.normalize(firstV6.address);
    return normalize.substring(0, 19);
  },
};

export default eui64;
