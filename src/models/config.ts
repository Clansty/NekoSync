import YAML from "yaml";
import fsP from "fs/promises";
import fs from "fs";

type Host = {
  // 内网 v4
  v4: string;
  // v6
  v6?: string;
  // 用于计算 eui64 的 mac
  mac?: string;
};

type ResolveType = 4 | 6 | "all";

let config: {
  domain: string;
  port: number;
  cfToken: string;
  nic: string;
  zoneId: string;
  defaults: {
    pub: ResolveType;
    priv: ResolveType;
  };
  records: {
    [host: string]:
      | (Host & {
          pub?: ResolveType;
          priv?: ResolveType;
        })
      | { alias: string };
  };
};

export const getConfig = () => config;
export const reloadConfig = async () => {
  console.log("Reload config...");

  config = YAML.parse(await fsP.readFile(process.env.CONFIG || "./config.yaml", "utf-8"));
};

fs.watch(process.env.CONFIG || "./config.yaml", reloadConfig);
