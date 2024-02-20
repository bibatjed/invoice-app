import dotenv from "dotenv";
dotenv.config();
import bootstrapApplication from "./app";
import logger from "./logger";
import http from "http";
import sequelize from "./db/index";

sequelize
  .authenticate()
  .then(() => {
    const app = bootstrapApplication();

    http.createServer(bootstrapApplication()).listen(3000, () => {
      logger.info("Listening in port :3000");
    });
  })
  .catch((err) => {
    logger.error(err);
  });
