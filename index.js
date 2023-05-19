import express from 'express';
import ErrorHelper from './helpers/error.helpers.js';

import { init as MixorDBInit } from './db/connections/mixor.db.js';
import { COMMON_ERROR_MESSAGE, STATUS_CODES } from './config/constants/common.constants.js';
import routes from './routes/index.routes.js';

import LogHelpers from './helpers/log.helpers.js';

const Log = new LogHelpers('mixor-index');

MixorDBInit();

// Create an Express.js application
const app = express();

// Middleware to parse request body as JSON
app.use(express.json());

app.use(routes);

app.use((req, res) => {
  const error = ErrorHelper.create(COMMON_ERROR_MESSAGE.url_not_found, STATUS_CODES.ERROR.NOT_FOUND);
  ErrorHelper.send(res, error);
});

app.use((err, req, res) => {
  Log.error(err.stack);

  const error = ErrorHelper.create(COMMON_ERROR_MESSAGE.invalid, STATUS_CODES.ERROR.DEFAULT);
  ErrorHelper.send(res, error);
});

// Start the server
const PORT = 9000;
app.listen(PORT, () => {
  Log.info(`Server listening on port ${PORT}`);
});
