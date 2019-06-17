const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const Comments = require('../models/comments');
const User = require('../models/user');

router.post('/add-comment', checkAuth, (req, res, next) => {
  const {cleaningService_id, text, rate} = req.body;
  let name, imagePath;
  User.findById(req.user,
    {name: 1, 'customer.imagePath': 1},
    (err, doc) => {
      if (err) res.status(401).json({err});
      name = doc.name;
      imagePath = doc.customer.imagePath;
    }).then(data => {
    const comment = new Comments({
      user_id: req.user,
      cleaningService_id,
      text,
      rate,
      name,
      imagePath,
      date: new Date()
    });

    comment.save().then(result => {

      Comments.find(
        {cleaningService_id}, {rate: 1}, (err, doc) => {
          const length = doc.length;
          let sum = 0;
          doc.forEach(el => {
            sum += el.rate;
          });
          const avgRate = (sum / length).toFixed(2);
          User.updateOne(
            {_id: cleaningService_id},
            {$set: {'company.rate': avgRate}},
            (err, result) => {
              if (err) res.status(500).json({err});
            }
          )
        });

      res.status(201).json({
        message: 'comment created',
        result
      });

    }).catch(err => {
      res.status(500).json({err})
    })
  });
});

router.get('/comments', (req, res) => {
  let companyId = req.query.companyId;
  if (companyId === 'company') {
    companyId = req.user;
  }
  Comments.find(
    {cleaningService_id: companyId},
    (err, doc) => {
      if (err) res.status(500).json({err});
      res.status(200).json(doc);
    }
  )
});
module.exports = router;
