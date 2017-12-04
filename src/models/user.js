const db = require('../db');
const isEmpty = require('lodash.isempty');

module.exports = {
  create: async ({ first_name, last_name, email, password }) => {
    // Insert values into table
    const { rows } = await db.query('INSERT INTO ping_pong.users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, email, password]);
    return rows;
  },
  remove: async function(email) {
    let val;
    // Check for email, if not delete all users
    if (isEmpty(email)) {
      val = await db.query('DELETE FROM ping_pong.users', []);
    } else {
      val = await db.query('DELETE FROM ping_pong.users WHERE email = $1', [email]);
    }
    return val.rows[0];
  },
  find: async function(email) {
    // Search for user
    const { rows } = await db.query('SELECT * FROM ping_pong.users WHERE email = $1', [email]);
    return rows;
  }
};