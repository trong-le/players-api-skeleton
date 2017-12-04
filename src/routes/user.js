const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const omit = require('lodash.omit');
const { User } = require('../models');
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
      email,
      password,
      confirm_password
    } = req.body;

    if (!first_name || !last_name || !email || password !== confirm_password) {
      const err = new Error('All inputs must have a value');
      err.status = 409;
      throw err;
    }

    const user = await db.query(`SELECT * FROM ping_pong.users WHERE email = '${email}'`);
    if (user.rows.length > 0 && user.rows[0].email === email) {
      const err = new Error('User with email already exists');
      err.status = 409;
      throw err;
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const createdUser = await User.create({ first_name, last_name, email, password: hashedPass });
    const token = jwt.sign({ id: createdUser[0].id }, 'mysecret');

    res.status(201).send({ success: true, user: { ...createdUser[0], id: String(createdUser[0].id) }, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
