import CloudflareSync from "./controllers/cloudflareSync.js";
import LocalDnsServer from "./controllers/localDnsServer.js";
import { reloadConfig } from "./models/config.js";

(async () => {
  await reloadConfig();
  await new LocalDnsServer().listen();
  new CloudflareSync().startTimer();
  console.log("Started!");
})();
