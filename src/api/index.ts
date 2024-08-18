import 'express-async-errors';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import { initializeApp } from '../common/initialize';
import middleware from '../common/middleware';
import routes from './routes/slack.routes';

const app = express();
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await initializeApp();

    // Body Parser Middleware
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    // Compression Middleware
    app.use(compression());

    app.use(cors());

    app.use('/slack', middleware.logMiddleware, middleware.checkToken, routes);

    app.get('/health', (req: Request, res: Response) =>
      res.status(200).send({ message: 'OK' }),
    );

    // Error handling middleware
    // eslint-disable-next-line unused-imports/no-unused-vars
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (process.env.NODE_ENV === 'production') {
        return res.status(200).end();
      }

      const status = err.status || 500;
      const message = err.message || 'Internal Server Error';

      console.log(err);

      return res.status(status).json({
        success: false,
        message,
        error: err.stack, // Hide stack trace in production
      });
    });

    app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Not Found',
      });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
})();
