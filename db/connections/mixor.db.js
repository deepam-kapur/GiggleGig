import mysql from 'mysql2/promise';
import LogHelpers from '../../helpers/log.helpers.js';

import Config from '../../config/index.js';

const Log = new LogHelpers('Mixor.DB');

Log.info('Connection establishing.....');

// Create a connection pool
const pool = mysql.createPool({
  // MySQL database connection details
  host: Config.DB_HOST,
  user: Config.DB_USER,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  port: Config.DB_PORT,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  ssl: {
    // Enable SSL options here
    rejectUnauthorized: true,
  },
});

pool.on('error', (err) => {
  Log.error('Error in MySQL connection pool:', err);
});

// Override the `query` method to log each query
const originalQuery = pool.query;
pool.query = async function (sql, values) {
  if(values){
    Log.info('Executing query:', sql, 'with values:', values);
  } else{
    Log.info('Executing query:', sql);
  }
  return originalQuery.apply(this, arguments);
};

const init = () => {
  pool.query('select 1').then(() => Log.info('Database Connected!'));
};

export {
  init,
};

export default pool;
