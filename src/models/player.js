const db = require('../db');
const isEmpty = require('lodash.isempty');

module.exports = {
  create: async ({ user_id, first_name, last_name, rating, handedness }) => {
    const id = (user_id === undefined || user_id === 'undefined') ? null : user_id;
    const query = `INSERT INTO ping_pong.players(user_id, first_name, last_name, rating, handedness) VALUES (${id}, '${first_name}', '${last_name}', '${rating}', '${handedness}') RETURNING *`;
    const { rows } = await db.query(query);
    return rows[0];
  },
  getPlayers: async (user_id) => {
    const { players } = await db.query('SELECT * FROM ping_pong.players WHERE user_id = $1', [user_id]);
    return players;
  },
  find: async (first_name, last_name) => {
    const { rows } = await db.query('SELECT * FROM ping_pong.players WHERE first_name = $1 AND last_name = $2', [first_name, last_name]);
    return rows[0];
  },
  remove: async (names) => {
    let val;
    if (isEmpty(names)) {
      val = await db.query('DELETE FROM ping_pong.players', []);
    } else {
      val = await db.query('DELETE FROM ping_pong.players WHERE first_name = $1 AND last_name = $2', [names.first_name, names.last_name]);
    }
    return val.rows[0];
  }
};