import LogHelpers from '../helpers/log.helpers.js';
const Log = new LogHelpers('Webhook-Controller');

import ErrorHelper from '../helpers/error.helpers.js';
import InstagramMessageSvc from '../services/instagram.message.svc.js';

import { COMMON_ERROR_MESSAGE, STATUS_CODES, WEBHOOK_OBJECT_TYPE } from '../config/constants/common.constants.js';

import ResponseHelpers from '../helpers/response.helpers.js';

const processWebhook = async (req, res) => {
  const { headers, body } = req;
  try {
    const { object, entry } = body;
    switch (object) {
      case WEBHOOK_OBJECT_TYPE.INSTAGRAM: {
        const entries = await Promise.allSettled(entry.map((entity) => entity && Promise.all(entity.messaging.map(InstagramMessageSvc.process))));
        console.log(entries);
        break;
      }
      default: {
        throw ErrorHelper.create(COMMON_ERROR_MESSAGE.object_type_not_supported, STATUS_CODES.ERROR.BAD_REQUEST);
      }
    }
    return ResponseHelpers.send(res, 'EVENT_RECEIVED', STATUS_CODES.SUCCESS);
  } catch (e) {
    Log.error(e, { headers, body });
    return ResponseHelpers.send(res, e);
  }
};

const validateWebhook = (req, res) => {
  const { headers, body, query } = req;
  try {
    const challenge = query['hub.challenge'];
    Log.record('Webhook Verified - ', challenge);
    return ResponseHelpers.send(res, challenge);
  } catch (e) {
    Log.error(e, { headers, body });
    return ResponseHelpers.send(res, e);
  }
};

export default {
  processWebhook,
  validateWebhook,
};
