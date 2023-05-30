import CloudflareSync from "./controllers/cloudflareSync.js";
import LocalDnsServer from "./controllers/localDnsServer.js";
import { getConfig, reloadConfig } from "./models/config.js";
import fs from "fs";

let cfSync: CloudflareSync;

(async () => {
  await reloadConfig();
  await new LocalDnsServer().listen();
  if (getConfig().cfToken) {
    cfSync = new CloudflareSync();
    cfSync.startTimer();
  }

  fs.watch(process.env.CONFIG || "./config.yaml", () => {
    reloadConfig();
    if (cfSync) {
      cfSync.updateRecord();
    }
  });

  console.log("Started!");
})();
