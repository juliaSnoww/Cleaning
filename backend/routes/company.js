const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');

router.post("/signup", (req, res, next) => {
    const rate = 0;
    const {
      name,
      email,
      description,
      logo,
      address,
      password,
      costPerUnit,
    } = req.body;
    bcrypt.hash(password, 10)
      .then(hash => {
        const company = new User({
          type:'company',
          name,
          email,
          password: hash,
          company: {
            description,
            logo,
            address,
            costPerUnit,
            rate
          }
        });
        company.save()
          .then(result => {
            res.status(201).json({
              message: 'Company created',
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

router.get('/get-all-company', (req, res) => {
  User.find({type:'company'}).exec(function (err, company) {
    if (err) throw err;

    res.status(200).json({company})
  });

});

module.exports = router;
