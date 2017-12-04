const db = require('../db');

module.exports = {
  create: async ({ created_by, first_name, last_name, rating, handedness }) => {
    // Insert player with created_by being foreign key
    // eslint errors because of single-quotes so using template literals
    const query = `INSERT INTO ping_pong.players(created_by, first_name, last_name, rating, handedness) VALUES (${created_by}, '${first_name}', '${last_name}', '${rating}', '${handedness}') RETURNING *`;
    const { rows } = await db.query(query);
    return rows[0];
  },
  getPlayers: async (created_by) => {
    // Return list of players created by user
    let { rows } = await db.query('SELECT * FROM ping_pong.players WHERE created_by = $1', [created_by]);
    return rows;
  },
  find: async (first_name, last_name) => {
    // Return player with same first and last name
    const { rows } = await db.query('SELECT * FROM ping_pong.players WHERE first_name = $1 AND last_name = $2', [first_name, last_name]);
    return rows[0];
  },
  findById: async (id) => {
    // Return user by ID
    const { rows } = await db.query('SELECT * FROM ping_pong.players WHERE id = $1', [id]);
    return rows[0];
  },
  remove: async ({ id, created_by }) => {
    // Delete all players, unless specified by ID and authorized user
    let val;
    if (!id) {
      val = await db.query('DELETE FROM ping_pong.players', []);
    } else {
      val = await db.query('DELETE FROM ping_pong.players WHERE id = $1 AND created_by = $2', [id, created_by]);
    }
    return val.rows[0];
  }
};