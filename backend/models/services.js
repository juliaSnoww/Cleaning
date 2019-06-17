const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = mongoose.Schema({
  address: String,
  userInfo: {
    email: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    contactInfo: String
  },
  cleaningServiceInfo: {
    name: String,
    cleaningService_id: {type: Schema.Types.ObjectId, ref: 'User'}
  },
  cleaningType: String,
  apartmentDescription: {
    countOfBath: Number,
    countOfStandardRoom: Number,
    countOfLargeRoom: Number
  },
  cleaningDate: Date,
  preferredTime: String,
  regularity: String,
  price: Number,
  statusInfo: {
    text: String,
    active: Boolean,
    status: String  // new confirm cancel
  }
});

module.exports = mongoose.model('Service', serviceSchema);
