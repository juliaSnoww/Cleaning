const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');
const Service = require('../models/services');

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
          type: 'company',
          name,
          email,
          password: hash,
          company: {
            description,
            logo,
            address,
            costPerUnit,
            rate
          },
          activeStatus: {
            status: true,
            reason: ''
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


router.put('/login/info', checkAuth, (req, res) => {
  const {name, address, type, description, rooms} = req.body;
  User.update(
    {_id: req.user},
    {
      $set: {
        name,
        'company.address': address,
        'company.description': description,
        'company.costPerUnit.type': type,
        'company.costPerUnit.rooms': rooms
      }
    },
    (err, result) => {
      if (err) res.status(500).json({msg: 'something wrong with update user info'});
      res.status(200).json({msg: 'ok'})
    }
  );
});

router.get('/profile', checkAuth, (req, res) => {
  User.findById(
    req.user,
    {name: 1, email: 1, company: 1},
    (err, doc) => {
      if (err) return res.status(500).json({err});
      if (!doc) return res.status(400).json({msg: 'not found'});
      const {name, company} = doc;
      res.status(200).json({
        name,
        company
      })
    }
  ).catch(err => {
    res.send({err})
  });
});

router.get('/get-all-company', (req, res) => {
  User.find({type: 'company', 'activeStatus.status': true}).exec(function (err, company) {
    if (err) res.status(500).json({err});
    res.status(200).json({company})
  });
});

router.get('/get-company', (req, res) => {
  const companyName = req.query.name;
  User.findOne(
    {name: companyName, 'activeStatus.status': true},
    {name: 1, company: 1},
    (err, company) => {
      if (err) res.status(500).json({err});
      res.status(200).json(company);
    }
  )
});

router.get('/orders', checkAuth, (req, res) => {
  Service.find(
    {'cleaningServiceInfo.cleaningService_id': req.user})
    .sort({cleaningDate: -1})
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({err})
    })
});

module.exports = router;
