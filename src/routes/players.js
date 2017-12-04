const { Router } = require('express');
const { Player } = require('../models');
const verifyJwt = require('../middlware/jwtverify');
const db = require('../db');

const router = new Router();

router.use(verifyJwt());
/*
 * Creates Player
 */
router.post('/', async (req, res, next) => {
  try {
    const { id } = req.token;
    const {
      first_name,
      last_name,
      rating,
      handedness,
      created_by
    } = req.body;

    if (!first_name || !last_name || !rating || !handedness) {
      const err = new Error('All fields must contain a value');
      err.status = 409;
      throw err;
    }

    if (!req.header('Authorization')) {
      const err = new Error('Missing Token');
      err.status = 403;
      throw err;
    }

    const duplicate = await Player.find(first_name, last_name);
    if (duplicate) {
      const err = new Error('Duplicate player');
      err.status = 409;
      throw err;
    }

    const player = await Player.create({ user_id: created_by, first_name, last_name, rating, handedness });
    res.status(201).send({ success: true, player });
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