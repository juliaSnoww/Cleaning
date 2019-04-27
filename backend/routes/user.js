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
            res.status(500).json({err})
          })
      })
  }
);
router.get('/login', (req, res) => {
  console.log(req.body)
  res.status(200).json({user:req.session});
});

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err || !user) res.status(400).json('Auth failed');
    else res.status(200).json({msg: 'ok'})
  })(req, res);
});

  /*  let fetchedUser;

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
          'secret'
        );
        res.status(200).json({token})
      })
      .catch(err => {
        return res.status(401).json({
          message: 'Auth failed'
        })
      })*/

module.exports = router;
