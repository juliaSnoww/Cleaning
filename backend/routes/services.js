const express = require('express');

const router = express.Router();

const Service = require('../models/services');
const User = require('../models/user');

router.post("/book", (req, res, next) => {
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
    if (req.user){
      userInfo.user_id = req.user;
      User.updateOne(
        {_id: req.user},
        {$set: {userInfo}}
      ).then(response => {
        res.status(200).json({response})
      });
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
        res.status(500).json({err})
      });
  }
);

module.exports = router;
