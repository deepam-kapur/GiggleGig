import express from 'express';
import ErrorHelper from './helpers/error.helpers.js';
import ResponseHelper from './helpers/response.helpers.js';

import { init as MixorDBInit } from './db/connections/mixor.db.js';
import { COMMON_ERROR_MESSAGE, STATUS_CODES } from './config/constants/common.constants.js';
import routes from './routes/index.routes.js';

import initModelsAssociation from './db/models/init.models.js';

import LogHelpers from './helpers/log.helpers.js';

const Log = new LogHelpers('mixor-index');

// @ts-ignore
MixorDBInit().then(() => initModelsAssociation());

// Create an Express.js application
const app = express();

// Middleware to parse request body as JSON
app.use(express.json({
  // @ts-ignore
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      // @ts-ignore
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  },
}));

app.use(routes);

// @ts-ignore
app.use((req, res) => {
  const error = ErrorHelper.create(COMMON_ERROR_MESSAGE.url_not_found, STATUS_CODES.ERROR.NOT_FOUND);
  ResponseHelper.send(res, error);
});

// @ts-ignore
app.use((err, req, res) => {
  // @ts-ignore
  Log.error(err.stack);

  const error = ErrorHelper.create(COMMON_ERROR_MESSAGE.invalid, STATUS_CODES.ERROR.DEFAULT);
  ResponseHelper.send(res, error);
});

// Start the server
const PORT = 9000;
app.listen(PORT, () => {
  Log.info(`Server listening on port ${PORT}`);
});
