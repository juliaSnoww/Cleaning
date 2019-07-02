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
  const {bath, standard, large, type: selectedType, address} = req.query;
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
      if (el.company.address) {
        console.log(address)
        let lt1 = +address.split(',')[0];
        let ln1 = +address.split(',')[1];
        let lt2 = +el.company.address.split(',')[0];
        let ln2 = +el.company.address.split(',')[1];
        if (lt1 && lt2) item['distance'] = calculateTheDistance(lt1, ln1, lt2, ln2);
      }
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

function calculateTheDistance(lt1, ln1, lt2, ln2) {
  const EARTH_RADIUS = 6372795;
  let lat1 = lt1 * Math.PI / 180;
  let lat2 = lt2 * Math.PI / 180;
  let long1 = ln1 * Math.PI / 180;
  let long2 = ln2 * Math.PI / 180;

  let cl1 = Math.cos(lat1);
  let cl2 = Math.cos(lat2);
  let sl1 = Math.sin(lat1);
  let sl2 = Math.sin(lat2);
  let delta = long2 - long1;
  let cdelta = Math.cos(delta);
  let sdelta = Math.sin(delta);
  let y = Math.sqrt((cl2 * sdelta) ** 2 + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
  let x = sl1 * sl2 + cl1 * cl2 * cdelta;

  let ad = Math.atan2(y, x);
  let dist = ad * EARTH_RADIUS;

  return dist;
}

module.exports = router;
