const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  const notification = false;
  const {name, email, password} = req.body;
  User.find({email: email}, (err, doc) => {
    if (doc.length !== 0) {
      return res.status(400).json({
        message: 'User with this email already exist'
      })
    }
  });
  bcrypt.hash(password, 10)
    .then(hash => {
      const user = new User({
        type: 'user',
        name,
        email,
        password: hash,
        customer: {
          imagePath: null,
          address: null,
          notification,
          reservationInfo: {
            address: null,
            cleaningType: null,
            apartmentDescription: {
              countOfBath: null,
              countOfStandardRoom: null,
              countOfLargeRoom: null
            },
            cleaningDate: null,
            preferredTime: null,
            regularity: null,
            activityInfo: {
              status: null,
              reason: null
            }
          }
        },
        activeStatus: {
          status: true,
          reason: ''
        }
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
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (!err && user) {
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr)
        }
        res.status(200).json({msg: 'ok', type: user.type})
      })
    } else {
      res.send({msg: err || 'unauthorised'})
    }
  })(req, res, next)
});

router.get('/profile', checkAuth, (req, res) => {
  User.findById(
    req.user,
    {name: 1, email: 1, customer: 1},
    (err, doc) => {
      if (err) return res.status(500).json({err});
      if (!doc) return res.status(400).json({msg: 'not found'});
      const {name, email, customer: {imagePath, address}} = doc;
      const reservationInfo = doc.customer.reservationInfo;
      res.status(200).json({
        userInfo: {
          name,
          email,
          imagePath,
          address
        },
        reservationInfo
      })
    }
  ).catch(err => {
    res.send({err})
  });
});

router.put('/login/pass', checkAuth, (req, res) => {
  const {oldPsw, newPsw} = req.body;
  User.findOne({_id: req.user})
    .then(user => {
      return bcrypt.compare(oldPsw, user.password);
    })
    .then(result => {
      if (!result) {
        res.send({msg: "Old password wrong"})
      }
      else {
        bcrypt.hash(newPsw, 10).then(hash => {
          User.updateOne(
            {_id: req.user},
            {$set: {password: hash}},
            (err, result) => {
              if (err) res.status(500).json({err});
              res.status(200).json({msg: 'ok'})
            }
          );
        })
      }
    })
    .catch(err => {
      return res.status(400).json({
        message: "Something Wrong"
      });
    });
});

router.put('/login/info', checkAuth, (req, res) => {
  const {name, email, address} = req.body;
  User.update(
    {_id: req.user},
    {$set: {name, email, 'customer.address': address}},
    (err, result) => {
      if (err) res.status(500).json({msg: 'something wrong with update user info'});
      res.status(200).json({msg: 'ok'})
    }
  );
});

module.exports = router;
