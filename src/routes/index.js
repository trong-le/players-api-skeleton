const { Router } = require('express');
const login = require('./login');
const user = require('./user');
const players = require('./players');

const router = new Router();

// Connect routes
router.use(login);
router.use('/user', user);
router.use('/players', players);

module.exports = router;