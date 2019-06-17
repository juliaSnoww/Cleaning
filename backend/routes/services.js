const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const Service = require('../models/services');
const User = require('../models/user');

router.post('/book', (req, res) => {
  const {
    date: cleaningDate,
    time: preferredTime,
    address,
    apartmentDescription,
    regularity,
    userInfo,
    cleaningType,
    cleaningServiceInfo,
    price
  } = req.body;
  const statusInfo = {
    text: '',
    active: 0,
    status: 'new'
  };
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
    price,
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

router.get('/orders', checkAuth, (req, res) => {
  Service.find(
    {'userInfo.user_id': req.user})
    .sort({cleaningDate: -1})
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({err})
    })
});

router.get('/order', checkAuth, (req, res) => {
  Service.findById(req.query.id)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json(err))
});

router.put('/order', checkAuth, (req, res) => {
  const {idOrder, status, reason} = req.body;
  const active = (status !== 'canceled');
  Service.updateOne(
    {_id: idOrder},
    {
      $set: {
        'statusInfo.active': active,
        'statusInfo.text': reason || null,
        'statusInfo.status': status
      }
    })
    .then(result => {
      res.status(200).json({message: 'reserve status updated'})
    })
    .catch(err => res.status(500).json({err}));
});

router.get('/offers', (req, res) => {
  const {bath, standard, large, type: selectedType} = req.query;
  const queryParam = {};
  const param = 'company.costPerUnit.type.' + selectedType;
  queryParam[param] = {$exists: true};
  User.find(queryParam, (err, companyArray) => {
    if (err) res.status(500).json({err});

    companyArray = companyArray.map(el => {
      let item = {};
      item['company'] = el.company;
      item['name'] = el.name;
      item['_id'] = el._id;
      const {costPerUnit: {rooms, type}} = el.company;
      const typeCost = type[selectedType];
      const price = typeCost * (rooms.bath * bath +
        rooms.standard * standard + rooms.large * large);
      item.price = price;
      return item;
    });
    res.status(200).json(companyArray)
  })
});

router.post('/price', (req, res) => {
  const companyId = req.body.cleaningServiceInfo.cleaningService_id;
  User.findById(companyId, {'company.costPerUnit': 1}, (err, doc) => {
    if (!doc) res.status(401).json({message: 'user is not defined', err});
    const clientRooms = req.body.apartmentDescription;
    const selectedType = req.body.cleaningType;
    let rooms, type;
    if (doc.company) {
      rooms = doc.company.costPerUnit.rooms;
      type = doc.company.costPerUnit.type;
    }
    else {
      rooms = doc.costPerUnit.rooms;
      type = doc.costPerUnit.rooms;
    }
    const typeCost = type[selectedType];
    const price = typeCost * (rooms.bath * clientRooms.countOfBath +
      rooms.standard * clientRooms.countOfStandardRoom +
      rooms.large * clientRooms.countOfLargeRoom);
    res.status(200).json(price);
  }).catch(err => {
    res.status(401).json({message: 'user is not defined', err})
  })
});

module.exports = router;
