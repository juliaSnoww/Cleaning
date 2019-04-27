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

router.post('/login',
  passport.authenticate('local'),
  (req,res) =>{
  console.log(req.session);
  res.status(200).json({msg:'ok'})
});

router.get('/login', (req, res) => {
  console.log(req.session)
  console.log(req.passport)
  console.log(req.sessionID);
  res.status(200).json({user: req.session});
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
