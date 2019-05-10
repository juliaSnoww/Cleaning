const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: {type: String, required: true,unique: false},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  imagePath: String,
  address: String,
  notification: Boolean,
  reservationInfo: {
    address: String,
    cleaningType: String,
    apartmentDescription: {
      countOfBath: Number,
      countOfStandardRoom: Number,
      countOfLargeRoom: Number
    },
    preferredTime: Date,
    regularity: String,
    activityInfo: {
      status: String,
      reason: String
    }
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

/*
String
Number
Date
Buffer
Boolean
Mixed
ObjectId
Array
Decimal128
Map
*/
