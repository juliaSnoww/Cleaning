const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const Company = require('../models/company');

router.post("/signup", (req, res, next) => {
    const {
      name,
      email,
      description,
      logo,
      address,
      password,
      costPerUnit
    } = req.body;
    bcrypt.hash(password, 10)
      .then(hash => {
        const company = new Company({
          name,
          email,
          description,
          password: hash,
          logo,
          address,
          costPerUnit
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

router.get('/login', (req, res) => {
  res.status(200).json({user: req.user});
});

module.exports = router;
