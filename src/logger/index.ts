import pino from "pino";
import PinoHttp from "pino-http";

const logger = pino(
    {
        level: "debug",
        timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    }
)

export { PinoHttp };
export default logger;
