import { getConfig } from "../models/config.js";
import DnsServer from "../server/dnsServer.js";
import dnsPacket from "dns-packet";
import { RemoteInfo } from "dgram";
import dnsUtils from "../utils/dnsUtils.js";
import eui64 from "../utils/eui64.js";

export default class {
  private server: DnsServer;

  constructor() {
    this.server = new DnsServer({
      port: getConfig().port,
    });

    this.server.on("request", (request: dnsPacket.Packet, response: (packet: dnsPacket.Packet) => any, rinfo: RemoteInfo) => {
      for (const question of request.questions) {
        console.log('Query for', question.name, question.type);

        const components = dnsUtils.getDomainComponents(question.name);
        const host = components.zones.find((it) => it.zone === getConfig().domain);
        if (!host) {
          response(dnsUtils.createNotFoundResponseFromRequest(request));
          continue;
        }
        const config = getConfig().records[host.host];
        if (!config) {
          response(dnsUtils.createNotFoundResponseFromRequest(request));
          continue;
        }

        const answers: dnsPacket.Answer[] = [];

        const addV4Answer = () => {
          answers.push({
            type: "A",
            data: config.v4,
            name: question.name,
            ttl: 60,
          });
        };
        const addV6Answer = () => {
          answers.push({
            type: "AAAA",
            data: config.v6 || eui64.getIP(config.mac),
            name: question.name,
            ttl: 60,
          });
        };

        switch (config.priv || getConfig().defaults.priv) {
          case 4:
            addV4Answer();
            break;
          case 6:
            addV6Answer();
            break;
          case "all":
            addV4Answer();
            addV6Answer();
            break;
        }

        response(dnsUtils.createSuccessResponseFromRequest(request, answers));
      }
    });
  }

  public async listen() {
    return await this.server.listen();
  }
}
