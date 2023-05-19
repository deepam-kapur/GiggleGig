import { config } from 'dotenv';

import externalConfig from '../dynamics/.external.uri.config.json' assert { type: 'json' };
import internalConfig from '../dynamics/.internal.uri.config.json' assert { type: 'json' };

config({ path: '../dynamics/.env' });

const defaultConfig = {
  PORT: 8080,
  ENVIRONMENT: 'development',
};

const args = process.argv.slice(2);
const argsConfig = args.reduce((final, arg) => {
  const [key, value] = arg.split('=');
  return { ...final, [key]: value };
}, {});

const mergedConfig = {
  ...defaultConfig,
  ...externalConfig,
  ...internalConfig,
  ...process.env,
  ...argsConfig,
};

export default mergedConfig;
