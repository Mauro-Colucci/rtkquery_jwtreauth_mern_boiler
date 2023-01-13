import rateLimit from "express-rate-limit";
import { logEvents } from "./logger.js";

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1min
  max: 5, // limit each ip to 5 login request per window per minute
  message: {
    message:
      "Too many login attempts from this IP, please try again after 60 seconds.",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // return rate limit info in the "RateLimit-" headers
  legacyHeaders: false, // disable the "X-RateLimit-*" headers
});

export default loginLimiter;
