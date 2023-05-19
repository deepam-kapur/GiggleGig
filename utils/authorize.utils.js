import Crypto from 'crypto';
import Config from '../config/index.js';
import ErrorHelper from '../helpers/error.helpers.js';

import { COMMON_ERROR_MESSAGE, STATUS_CODES } from '../config/constants/common.constants.js';

const { FB_TOKEN } = Config;

const check = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.BAD_REQUEST);
  }

  const buf = req.body;
  const encryptedToken = Crypto.createHmac('sha256', FB_TOKEN).update(buf).digest('hex');

  if (signature !== encryptedToken) {
    throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.BAD_REQUEST);
  }

  next();
};

const validate = (req, res, next) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];

  if (mode !== 'subscribe' || token !== FB_TOKEN) {
    throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.FORBIDDEN);
  }

  next();
};

export default {
  check,
  validate,
};
