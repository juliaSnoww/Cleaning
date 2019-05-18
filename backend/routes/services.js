const express = require('express');
const passport = require('passport');

const router = express.Router();

const Service = require('../models/services');

router.post("/book", (req, res, next) => {
    console.log(req.body);
    const {
      date: cleaningDate,
      time: preferredTime,
      address,
      apartmentDescription,
      regularity,
      email,
      cleaningType,
      cost
    } = req.body;
    const service = new Service({
      email,
      cleaningType,
      apartmentDescription,
      cleaningDate,
      preferredTime,
      regularity,
      address,
      cost
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
