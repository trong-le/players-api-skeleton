const { Router } = require('express');
const { Player } = require('../models');
const db = require('../db');

const router = new Router();

/*
 * Creates Player
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      rating,
      handedness
    } = req.body;

    if (!req.header('Authorization')) {
      const err = new Error('Missing Token');
      err.status = 403;
      throw err;
    }


    const players = await Player.create({ first_name, last_name, rating, handedness });
    res.status(201).send({ success: true, players });
  } catch (err) {
    next(err);
  }
});

/*
 * Returns all players
 */
router.get('/', async (req, res) => {
  const players = await Player.getPlayers();
  res.status(200).send({ success: true, players });
});

/*
 * Delete player with given ID
 */
router.delete('/:id', async (req, res) => {
  const playerId = req.params.id;
  await db.query('DELETE FROM ping_pong.players WHERE user_id = $1', [playerId]);
  res.status(201).send({ success: true });
});

module.exports = router;