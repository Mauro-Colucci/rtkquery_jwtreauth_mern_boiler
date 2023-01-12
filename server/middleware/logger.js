import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { appendFile, mkdir } from "fs/promises";
import fileDirName from "../config/fileAndDirName.js";

import path from "path";
import { existsSync } from "fs";

const { __dirname } = fileDirName(import.meta);

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!existsSync(path.join(__dirname, "..", "logs"))) {
      //const projectFolder = new URL("./test/project/", import.meta.url);
      //const createDir = await mkdir(projectFolder, { recursive: true });
      await mkdir(path.join(__dirname, "..", "logs"));
    }
    await appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
