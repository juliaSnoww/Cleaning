const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  userInfo: {
    username: String,
  //  user_id: ObjectId,
    contactInfo: String
  },
  email: String,
  address:String,
  cleaningServiceInfo: {
    name: String,
    //cleaningService_id: ObjectId
  },
  cleaningType: String,
  apartmentDescription: {
    countOfBath: Number,
    countOfStandardRoom: Number,
    countOfLargeRoom: Number
  },
  cleaningDate: String,
  preferredTime: String,
  regularity: String,
  cost: Number,
  statusInfo: {
    active: Boolean,
    status: String
  }
});

module.exports = mongoose.model('Service', serviceSchema);
