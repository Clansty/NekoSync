import dgram, { RemoteInfo } from "dgram";
import dnsPacket from "dns-packet";
import EventEmitter from "events";

export default class extends EventEmitter {
  type: dgram.SocketType;
  wildcard: string;
  port: number;
  address: string;
  socket: dgram.Socket;
  constructor(options: { type?: dgram.SocketType; port?: number; address?: string; }) {
    super();
    this.type = options.type ? options.type : "udp4";
    this.wildcard = this.type == "udp4" ? "0.0.0.0" : "::";
    this.port = options.port ? options.port : 53;
    this.address = options.address ? options.address : this.wildcard;

    this.socket = dgram.createSocket(this.type);
    this.socket.on("message", this.handle.bind(this));
  }
  private handle = function (message: Buffer, rinfo: RemoteInfo) {
    const packet = dnsPacket.decode(message);
    this.emit("request", packet, this.send.bind(this, rinfo), rinfo);
  };
  private send = function (rinfo: RemoteInfo, message: dnsPacket.Packet) {
    const buf = dnsPacket.encode(message);
    this.socket.send(buf, rinfo.port, rinfo.address, (err) => {});
  };
  listen() {
    return new Promise<void>((resolve) => this.socket.bind(this.port, this.address, resolve));
  }
}
