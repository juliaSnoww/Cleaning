const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');

router.post("/signup", (req, res, next) => {
  const notification = false;
  const {name, email, password} = req.body;
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

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.status(200).json({msg: 'ok'})
  });

router.get('/profile', (req, res) => {
  User.findById(req.user, (err, doc) => {
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
  }).catch(err => {
    res.send({err})
  });
});

router.put('/login/pass', (req, res) => {
  const {name, email, address} = req.body.userInfo;
  const {oldPass, newPass} = req.body.pass;
  User.findOne({_id: req.user})
    .then(user => {
      return bcrypt.compare(oldPass, user.password);
    })
    .then(result => {
      if (!result) {
        User.updateOne(
          {_id: req.user},
          {$set: {name, email, 'customer.address': address}}
        ).then(response => {
          res.send({
            message: "Old password wrong"
          })
        })
      }
      else {
        bcrypt.hash(newPass, 10).then(hash => {
          User.updateOne(
            {_id: req.user},
            {$set: {name, email, 'customer.address': address, password: hash}},
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

router.put('/login/info', (req, res) => {
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
