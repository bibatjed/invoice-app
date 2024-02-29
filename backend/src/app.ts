import express from "express";
const app = express();
import errorHandler from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import rTracer from "cls-rtracer";
import cors from "cors";
import initializeMorganMiddleware from "./middleware/morganMiddleware";
import router from "./routes/index";

function bootstrapApplication() {
  //TODO: move this to env
  app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(rTracer.expressMiddleware());
  app.use(initializeMorganMiddleware());

  app.use("/v1", router);

  app.use(errorHandler);
  return app;
}

export default bootstrapApplication;
