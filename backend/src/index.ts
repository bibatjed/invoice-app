import bootstrapApplication from "./app";
import logger from "./logger";
import http from "http";

http.createServer(bootstrapApplication()).listen(3000, () => {
  logger.info("Listening in port :3000");
});
