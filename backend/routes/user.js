const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(result => {
            res.status(201).json({
              message: 'User created',
              result
            })
          })
          .catch(err => {
            res.status(500).json({
              err
            })
          })
      })
  }
);

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.find({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'User doesn\'t exist'
        })
      }
      fetchedUser = user[0];
      return bcrypt.compare(req.body.password, user[0].password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      const token = jwt.sign({
          username: fetchedUser.username,
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        'secret',
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      })
    })
})
;

module.exports = router;
