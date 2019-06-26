const express = require('express');

const router = express.Router();

const transporter = require('../config/transport');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');

router.get('/clients', (req, res) => {
  User.find({type: 'user'}, {
    name: 1,
    email: 1,
    'activeStatus.status': 1,
    'activeStatus.reason': 1
  }).then(clients => {
    res.status(200).json(clients);
  }).catch(err => console.log(err))
});

router.get('/company', (req, res) => {
  User.find({type: 'company'}, {
    name: 1,
    email: 1,
    'activeStatus.status': 1,
    'activeStatus.reason': 1
  }).then(company => {
    res.status(200).json(company);
  }).catch(err => console.log(err))
});

router.post('/block', (req, res) => {
  const {id, reason} = req.body;
  User.update({_id: id}, {
    $set: {
      'activeStatus.status': false,
      'activeStatus.reason': reason
    }
  }).then(company => {
    const mailOptions = {
      from: 'juliasnoww@mail.ru',
      to: 'juliasnoww@mail.ru',
      subject: 'You was blocked',
      html: '<p>You was blocked<br> Reason: ' + reason + '</p>'// plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
    res.status(200).json('deleted');
  }).catch(err => console.log(err))
});

router.post('/unblock', (req, res) => {
  const {id} = req.body;
  User.update({_id: id}, {
    $set: {
      'activeStatus.status': true,
      'activeStatus.reason': ''
    }
  }).then(company => {
    res.status(200).json('unblocked');
  }).catch(err => console.log(err))
});

module.exports = router;
