import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config({ path: path.normalize(`${__dirname}/../../dynamic/.env`) });

export default {
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USERNAME: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASS || '',
    DATABASE: process.env.DB_NAME || 'giggle_gig',
  },
  ENVIRONMENT: process.env.ENVIRONMENT,
  SERVICE_NAME: process.env.SERVICE_NAME,
  LOGS: process.env.LOGS === 'true',
  HEADER_TOKEN: process.env.HEADER_TOKEN,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  LLM_URL: process.env.LLM_URL,
};
