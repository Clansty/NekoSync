import Cloudflare from "cloudflare";
import { getConfig } from "../models/config.js";
import { GetRecordsRet } from "../types/CloudFlare.js";
import eui64 from "../utils/eui64.js";
import ip6 from "ip6";

export default class {
  private cf: Cloudflare;

  constructor() {
    this.cf = new Cloudflare({
      token: getConfig().cfToken,
    });
  }

  private async checkAddRecord(existedRecords: GetRecordsRet, host: string, type: "A" | "AAAA" | "CNAME", content: string) {
    const existed = existedRecords.result.find((it) => it.name === host + "." + it.zone_name && it.type === "CNAME");
    if (existed?.content === content) return;
    if (existed) {
      console.log("Delete record:", host, type);
      await this.cf.dnsRecords.del(existed.zone_id, existed.id);
    }
    console.log("Adding record:", host, type, content);
    await this.cf.dnsRecords.add(getConfig().zoneId, {
      name: host,
      content,
      ttl: 1,
      type,
      proxied: false,
    });
  }

  private async updateRecord() {
    const existedRecords = (await this.cf.dnsRecords.browse(getConfig().zoneId)) as GetRecordsRet;
    if (!existedRecords.success) {
      console.log("Get records failed", existedRecords.errors);
    }

    for (const [host, config] of Object.entries(getConfig().records)) {
      if ("alias" in config) {
        await this.checkAddRecord(existedRecords, host, "CNAME", config.alias + "." + getConfig().domain);
      } else {
        if (config.pub === 4 || config.pub === "all") {
          await this.checkAddRecord(existedRecords, host, "A", config.v4);
        }
        if (config.pub === 6 || config.pub === "all") {
          await this.checkAddRecord(existedRecords, host, "AAAA", config.v6 || ip6.abbreviate(eui64.getIP(config.mac)));
        }
      }
    }
  }

  public startTimer() {
    setInterval(() => this.updateRecord(), 1000 * 60 * 10);
    this.updateRecord();
  }
}
