import type { NextFunction, Request, Response } from 'express';
import type { Format } from 'logform';
import { createLogger, format, transports } from 'winston';

import config from '../config';

const { HEADER_TOKEN } = config;

const checkToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.query?.token;
  if (!token) {
    res.status(401).json({
      status: 'Unauthorized!',
    });

    return;
  }

  if (token !== HEADER_TOKEN) {
    res.status(401).json({
      status: 'Unauthorized!',
    });

    return;
  }

  next();
};

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

const customFormat: Format = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
});

const logMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.info(
    `logMiddleware - ${JSON.stringify(
      {
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
        method: req.method,
        headers: req.headers,
        timestamp: new Date().toISOString(),
      },
      null,
      4,
    )}`,
  );

  next();
};

export default {
  checkToken,
  logMiddleware,
};
