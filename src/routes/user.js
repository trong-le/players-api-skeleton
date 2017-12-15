const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const jwtSecret = process.env.JWT_SECRET || 'mysecret';
const router = new Router();

/*
 * Creates User
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

    if (!first_name || !last_name || !email || !password || password !== confirm_password) {
      const err = new Error('All inputs must have a value');
      err.status = 409;
      throw err;
    }

    const lowerEmail = email.toLowerCase();
    const user = await User.find(lowerEmail);
    if (user.length > 0 && user[0].email === lowerEmail) {
      const err = new Error('User with email already exists');
      err.status = 409;
      throw err;
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const createdUser = await User.create({ first_name, last_name, email: lowerEmail, password: hashedPass });
    const token = jwt.sign({ id: createdUser[0].id }, jwtSecret);

    res.status(201).send({ success: true, user: { ...createdUser[0], id: String(createdUser[0].id) }, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
