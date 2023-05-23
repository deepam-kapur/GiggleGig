import { Sequelize } from 'sequelize';
import LogHelpers from '../../helpers/log.helpers.js';
import Config from '../../config/index.js';

const Log = new LogHelpers('Mixor.DB');
Log.info('Connection establishing.....');

// Create a Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  database: Config.DB_NAME,
  username: Config.DB_USER,
  password: Config.DB_PASSWORD,
  define: {
    timestamps: false, // Set to true if you want timestamps
  },
  logging: false, // Set to true if you want to see SQL logs
  dialectOptions: {
    ssl: {
      // Enable SSL options here
      rejectUnauthorized: true,
    },
  },
});

const init = () => {
  // Test the connection
  sequelize
    .authenticate()
    .then(() => {
      Log.info('Database Connected!');
    })
    .catch((error) => {
      Log.error('Unable to connect to the database:', error);
    });
};

export {
  init,
};

export default sequelize;
