require('dotenv').config({ path: '../dynamic/.env' });

const defaultConfig = {
  PORT: 8080,
  ENVIRONMENT: 'development',
};

const args = process.argv.slice(2);
const argsConfig = args.reduce(final, arg => {
  const [key, value] = arg.split('=');
  final[key] = value;
}, {});

module.exports = Object.assign({}, defaultConfig, process.env, argsConfig);
