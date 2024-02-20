import express from "express";
const app = express();
import errorHandler from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import rTracer from "cls-rtracer";
import initializeMorganMiddleware from "./middleware/morganMiddleware";

function bootstrapApplication() {
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(rTracer.expressMiddleware());
  app.use(initializeMorganMiddleware());

  app.use(errorHandler);
  return app;
}

export default bootstrapApplication;
