'use strict';

const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

///////////////////////JWT//////////////////////////
let refreshToken = [];

authRouter.post('/token', bearerAuth, (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken === null) return res.status(401);
  // if (!refreshToken.includes(refreshToken)) res.status(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

authRouter.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.status(204).send('token deleted');
})
///////////////////////JWT//////////////////////////


authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
  ///////////////////////JWT//////////////////////////
  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshToken.push(refreshToken)  
  res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken});
  ///////////////////////JWT//////////////////////////
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});

///////////////////////JWT//////////////////////////
function generateAccessToken(user) {
  return JsonWebTokenError.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}
///////////////////////JWT//////////////////////////

module.exports = authRouter;
