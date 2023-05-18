import LogHelper from '../../helpers/log.helpers';
const Log = new LogHelper('Mixor.DB');

import mysql from 'mysql2/promise';
import Config from '../../config'

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
    queueLimit: 0
});

pool.on('error', (err) => {
    Log.error('Error in MySQL connection pool:', err);
});

export default pool;