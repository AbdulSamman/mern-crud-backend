import express from "express";
import fs from "fs";

export const logPathAndFileName = "./src/logs/log.txt";

const logger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const date = new Date();
  const logLine = `${date.toISOString()} - ${req.originalUrl}`;
  fs.appendFileSync(logPathAndFileName, logLine + "\n");
  next();
};
export default logger;
