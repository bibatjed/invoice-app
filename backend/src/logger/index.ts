import { createLogger, format, transports } from "winston";
const { printf, combine, timestamp } = format;
import rTracer from "cls-rtracer";

const rTracerFormat = printf((info) => {
  const rid = rTracer.id();
  return rid ? `${info.timestamp} [request-id:${rid}]: ${info.message}` : `${info.timestamp}: ${info.message}`;
});
const logger = createLogger({
  format: combine(timestamp(), rTracerFormat),
  transports: [new transports.Console()],
});

export default logger;
