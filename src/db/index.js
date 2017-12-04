const connection = require('./pg_creds');
const { Pool } = require('pg');

const pool = new Pool(connection);

module.exports = {
  query: (text, params) => pool.query(text, params)
};