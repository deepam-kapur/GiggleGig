import Axios from 'axios';

import ErrorHelper from '../helpers/error.helpers.js';
import LogHelpers from '../helpers/log.helpers.js';

import Config from '../config/index.js';
import { COMMON_ERROR_MESSAGE, STATUS_CODES } from '../config/constants/common.constants.js';
import { FB_API_VERSION, FB_PROFILE_API_FIELDS } from '../config/constants/instagram.constants.js';

const Log = new LogHelpers('instagram-utils');
const { facebook, FB_API_ACCESS_TOKEN } = Config;

const fetchProfile = async (externalId) => {
  const response = await Axios.get(`${facebook}/${FB_API_VERSION}/${externalId}`, {
    params: {
      fields: FB_PROFILE_API_FIELDS.join(','),
      access_token: FB_API_ACCESS_TOKEN,
    },
  });
  if (!response || response.status !== STATUS_CODES.SUCCESS) {
    throw ErrorHelper.create(COMMON_ERROR_MESSAGE.api_giving_error, STATUS_CODES.ERROR.BAD_REQUEST);
  }

  return response.data;
};

const sendMessage = async (externalId, recipientId, text) => {
  const response = await Axios.get(`${facebook}/${FB_API_VERSION}/${externalId}/messages`, {
    params: {
      recipient: JSON.stringify({ id: recipientId }),
      message: JSON.stringify({ text }),
      access_token: FB_API_ACCESS_TOKEN,
    },

  });
  if (!response || response.status !== STATUS_CODES.SUCCESS) {
    throw ErrorHelper.create(COMMON_ERROR_MESSAGE.api_giving_error, STATUS_CODES.ERROR.BAD_REQUEST);
  }
  return true;
};

export default {
  fetchProfile,
  sendMessage,
};
