const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');

router.post("/signup", (req, res, next) => {
    const {username, email, password} = req.body;
    bcrypt.hash(password, 10)
      .then(hash => {
        const user = new User({
          username,
          email,
          password: hash,
          imagePath: null,
          address: null
        });
        user.save()
          .then(result => {
            res.status(201).json({
              message: 'User created',
              result
            })
          })
          .catch(err => {
            res.status(500).json({err})
          })
      })
  }
);

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.status(200).json({msg: 'ok'})
  });

router.get('/login', (req, res) => {
  User.findById(req.user, (err, doc) => {
    if (err) res.status(500).json({err});
    const {username, email, imagePath, address} = doc;
    res.status(200).json({
      username,
      email,
      imagePath,
      address
    });
  });

});

router.put('/login', (req, res) => {
  const {username, email, address} = req.body;
  User.updateOne(
    {_id: req.user},
    {$set: {username, email, address}},
    (err, result) => {
      if (err) res.status(500).json({err});
      res.status(200).json({msg: 'ok'})
    }
  );
});

module.exports = router;
