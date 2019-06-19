const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const passport = require('passport');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');
const Service = require('../models/services');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  '/signup',
  multer({storage: storage}).single('logo'),
  (req, res, next) => {
    const rate = 0;
    const {
      name,
      email,
      description,
      address,
      password
    } = req.body;
    const costPerUnit = JSON.parse(req.body.costPerUnit);
    let logo = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      logo = url + "/images/" + req.file.filename;
    }
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


router.put(
  '/login/info',
  multer({storage: storage}).single('logo'),
  checkAuth,
  (req, res) => {
    const {name, address, description} = req.body;
    const rooms = JSON.parse(req.body.rooms);
    const type = JSON.parse(req.body.type);
    let logo = req.body.logo;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      logo = url + "/images/" + req.file.filename;
    }
    User.update(
      {_id: req.user},
      {
        $set: {
          name,
          'company.logo': logo,
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
