// mysqlConnection.js
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // Your MySQL host (e.g., 'localhost')
    user: process.env.DB_USER,       // Your MySQL username
    password: process.env.DB_PASSWORD, // Your MySQL password
    database: process.env.DB_NAME    // Your MySQL database name
});

// Promisify the pool.query method to use async/await
const promisePool = pool.promise();

module.exports = promisePool;
