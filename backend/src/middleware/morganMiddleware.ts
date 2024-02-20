import morgan from "morgan";

import logger from "@src/logger";

class MyStream {
  write(text: string) {
    logger.info(text);
  }
}

export default function initializeMorganMiddleware() {
  return morgan("dev", { stream: new MyStream() });
}
