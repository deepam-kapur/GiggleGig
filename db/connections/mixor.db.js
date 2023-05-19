import mysql from 'mysql2/promise';
import LogHelpers from '../../helpers/log.helpers.js';

import Config from '../../config/index.js';

const Log = new LogHelpers('Mixor.DB');

Log.record('Connection establishing.....');

// Create a connection pool
const pool = mysql.createPool({
  // MySQL database connection details
  host: Config.DB_HOST,
  user: Config.DB_USER,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
});

pool.on('error', (err) => {
  Log.error('Error in MySQL connection pool:', err);
});

const init = () => {

};

export {
  init,
};

export default pool;
