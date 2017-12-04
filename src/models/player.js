const db = require('../db');
const isEmpty = require('lodash.isempty');

module.exports = {
  create: async ({ first_name, last_name, rating, handedness }) => {
    const player = await db.query('SELECT * FROM ping_pong.players WHERE first_name = $1 AND last_name = $2', [first_name, last_name]);
    if (player) {
      const err = new Error('Duplicate player');
      err.status = 409;
      throw err;
    }
    const { players } = await db.query('INSERT INTO ping_pong.players (first_name, last_name, rating, handedness) VALUES ($1, $2, $3, $4)', [first_name, last_name, rating, handedness]);
    return players;
  },
  getPlayers: async (user_id) => {
    const { players } = await db.query('SELECT * FROM ping_pong.players WHERE user_id = $1', [user_id]);
    return players;
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