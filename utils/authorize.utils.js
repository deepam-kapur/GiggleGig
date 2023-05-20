import Crypto from 'crypto';
import Config from '../config/index.js';
import ErrorHelper from '../helpers/error.helpers.js';
import ResponseHelpers from '../helpers/response.helpers.js';
import LogHelpers from '../helpers/log.helpers.js';

import { COMMON_ERROR_MESSAGE, STATUS_CODES } from '../config/constants/common.constants.js';

const Log = new LogHelpers('authorize-utils');

const { FB_TOKEN, FB_SECRET } = Config;

const check = (req, res, next) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
      throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.BAD_REQUEST);
    }

    const buf = req.rawBody;
    const encryptedToken = Crypto.createHmac('sha256', FB_SECRET).update(buf).digest('hex');

    if (signature !== `sha256=${encryptedToken}`) {
      throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.BAD_REQUEST);
    }
  } catch (e) {
    Log.error(e, { body: req.body, headers: req.headers });
    return ResponseHelpers.send(res, e);
  }
  return next();
};

const validate = (req, res, next) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];

    if (mode !== 'subscribe' || token !== FB_TOKEN) {
      throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.FORBIDDEN);
    }
  } catch (e) {
    Log.error(e, { body: req.body, headers: req.headers });
    return ResponseHelpers.send(res, e);
  }
  return next();
};

export default {
  check,
  validate,
};
