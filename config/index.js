import { config } from 'dotenv';
import path from 'path';

import externalConfig from '../dynamics/.external.uri.config.json' assert { type: 'json' };
import internalConfig from '../dynamics/.internal.uri.config.json' assert { type: 'json' };

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const normalizedDirname = process.platform === 'win32' ? __dirname.substring(1): __dirname;

config({ path: path.normalize(`${normalizedDirname}/../dynamics/.env`) });


console.log(path.normalize(`${normalizedDirname}/../dynamics/.env`));

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
