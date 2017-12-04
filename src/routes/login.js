const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = new Router();

/*
 * Create Login endpoint with valid user authentication
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Must not be empty inputs');
      err.status = 409;
      throw err;
    }

    const user = await User.find(email);
    // find returns array of found users, empty if none found
    if (user.length < 1) {
      const err = new Error('No user found');
      err.status = 401;
      throw err;
    }

    // Compare hashed password with text password
    if (!bcrypt.compareSync(password, user[0].password)) {
      const err = new Error('Invalid password');
      err.status = 401;
      throw err;
    }

    const token = jwt.sign({ id: user[0] }, 'mysecret');

    res.status(200).send({ success: true, user: { ...user[0], id: String(user[0].id) }, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
