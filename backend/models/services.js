const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = mongoose.Schema({
  address: {type: String, required: true},
  userInfo: {
    email: {type: String, required:true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    contactInfo: {type: String, required:true}
  },
  cleaningServiceInfo: {
    name: {type: String, required:true},
    cleaningService_id: {type: Schema.Types.ObjectId, ref: 'User'}
  },
  cleaningType: {type: String, required:true},
  apartmentDescription: {
    countOfBath: {type: Number, required:true},
    countOfStandardRoom: {type: Number, required:true},
    countOfLargeRoom: {type: Number, required:true}
  },
  cleaningDate: {type: Date, required:true},
  preferredTime: {type: String, required:true},
  regularity: {type: String, required:true},
  price: {type: Number, required:true},
  statusInfo: {
    text: {type: String, required:true},
    active: {type: Boolean, required:true},
    status: {type: String, required:true}  // new confirm cancel
  }
});

module.exports = mongoose.model('Service', serviceSchema);
