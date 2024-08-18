import axios from 'axios';

import config from '../config';
import { SLACK_ERROR_MESSAGE } from '../config/constants/response.constants';

const { LLM_URL } = config;

const processLLM = async (prompt: string) => {
  const response = await axios.post(`${LLM_URL}/api/generate`, {
    model: 'llama3.1',
    prompt,
    format: 'json',
    stream: false,
  });

  if (!response || response.status !== 200) {
    throw new Error(SLACK_ERROR_MESSAGE.LLM_NOT_WORKING);
  }

  return response.data;
};

export default {
  processLLM,
};
