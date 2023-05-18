import express, { Request, Response } from 'express';
import ErrorHelper from './helpers/error.helpers';
import MixorDB from './db/connections/mixor.db';

import LogHelpers from './helpers/log.helpers';
const Log = new LogHelpers('mixor-index');

import { COMMON_ERROR_MESSAGE, STATUS_CODES } from './config/constants/common.constants';

// Create an Express.js application
const app = express();

// Middleware to parse request body as JSON
app.use(express.json());

app.use('./routes');

app.use((req, res, next) => {
  const error = ErrorHelper.create(COMMON_ERROR_MESSAGE.url_not_found, STATUS_CODES.ERROR.NOT_FOUND);
  ErrorHelper.send(res, error);
});

app.use((err, req, res, next) => {
  Log.error(err.stack);
  
  const error = ErrorHelper.create(COMMON_ERROR_MESSAGE.invalid, STATUS_CODES.ERROR.DEFAULT);
  ErrorHelper.send(res, error);
});

// Start the server
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
