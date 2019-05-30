const express = require('express');

const router = express.Router();

const Service = require('../models/services');
const User = require('../models/user');

router.post('/book', (req, res, next) => {
  const {
    date: cleaningDate,
    time: preferredTime,
    address,
    apartmentDescription,
    regularity,
    userInfo,
    cleaningType,
    cleaningServiceInfo,
    cost,
    statusInfo
  } = req.body;
  if (req.user) {
    userInfo.user_id = req.user;
    User.updateOne(
      {_id: req.user},
      {
        $set: {
          'customer.address': address,
          'customer.reservationInfo': {
            address,
            apartmentDescription,
            cleaningDate,
            preferredTime,
            regularity,
            cleaningType,
          }
        }
      })
      .then(result => {
        res.status(200).json({message: 'reserve update'})
      })
      .catch(err => res.status(500).json({err}));
  }
  const service = new Service({
    userInfo,
    cleaningType,
    apartmentDescription,
    cleaningDate,
    preferredTime,
    regularity,
    address,
    cleaningServiceInfo,
    cost,
    statusInfo
  });
  service.save()
    .then(result => {
      res.status(201).json({
        message: 'service created',
        result
      })
    })
    .catch(err => {
      res.status(500).json({message: 'error service?', err})
    });
});

router.get('/orders', (req, res, next) => {
  Service.find({'userInfo.user_id': req.user}, (err, doc) => {
    if (err) res.status(500).json({err});
    res.status(200).json(doc);
  });
});

module.exports = router;
