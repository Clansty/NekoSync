import LocalDnsServer from "./controllers/localDnsServer.js";
import { reloadConfig } from "./models/config.js";

(async () => {
  await reloadConfig();
  await new LocalDnsServer().listen();
  console.log("Started!");
})();
