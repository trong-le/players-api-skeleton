const db = require('../db');
const isEmpty = require('lodash.isempty');

module.exports = {
  create: async ({ created_by, first_name, last_name, rating, handedness }) => {
    const id = (created_by === undefined || created_by === 'undefined') ? null : created_by;
    const query = `INSERT INTO ping_pong.players(created_by, first_name, last_name, rating, handedness) VALUES (${id}, '${first_name}', '${last_name}', '${rating}', '${handedness}') RETURNING *`;
    const { rows } = await db.query(query);
    return rows[0];
  },
  getPlayers: async (created_by) => {
    let val = await db.query('SELECT * FROM ping_pong.players WHERE created_by = $1', [created_by]);
    return val.rows;
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