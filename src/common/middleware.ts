import type { NextFunction, Request, Response } from 'express';

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

const logMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log({
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    method: req.method,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });

  next();
};

export default {
  checkToken,
  logMiddleware,
};
