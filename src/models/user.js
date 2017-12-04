const db = require('../db');

module.exports = {
  create: async ({ first_name, last_name, email, password }) => {
    // Insert values into table
    const { rows } = await db.query('INSERT INTO ping_pong.users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, email, password]);
    return rows;
  },
  remove: async function() {
    // Remove all users
    let { rows } = await db.query('DELETE FROM ping_pong.users', []);
    return rows[0];
  },
  find: async function(email) {
    // Search for user
    const { rows } = await db.query('SELECT * FROM ping_pong.users WHERE email = $1', [email]);
    return rows;
  }
};