const mysql = require('mysql2/promise');

/* 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'jorge',
  database: 'mydb',
});
*/

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',           // 'db' es el nombre del servicio MySQL en Docker Compose
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'jorge',
  database: process.env.DB_NAME || 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
