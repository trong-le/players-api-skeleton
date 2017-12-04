const { Router } = require('express');
const { Player } = require('../models');
const verifyJwt = require('../middlware/jwtverify');

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
      handedness
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

    const player = await Player.create({ created_by: id, first_name, last_name, rating, handedness });
    res.status(201).send({ success: true, player });
  } catch (err) {
    next(err);
  }
});

/*
 * Returns all players
 */
router.get('/', async (req, res, next) => {
  try {
    const { id } = req.token;
    const players = await Player.getPlayers(id);
    const stringifiedPlayers = players.map((player) => {
      return {
        ...player,
        id: String(player.id)
      };
    });
    res.status(200).send({ success: true, players: stringifiedPlayers });
  } catch (err) {
    next(err);
  }
});

/*
 * Delete player with given ID
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.token;
    const playerId = req.params.id;
    const player = await Player.findById(playerId);

    if (!player) {
      const err = new Error('Player not found');
      err.status = 404;
      throw err;
    }
    if (id !== player.created_by) {
      const err = new Error('Not authorized to delete player');
      err.status = 404;
      throw err;
    }

    await Player.remove({ id: playerId, created_by: id });
    res.status(200).send({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;