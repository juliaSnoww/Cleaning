const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  customer: {
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
  },
  company: {
    logo:  String,
    address: String,
    costPerUnit: {
      rooms: {
        bath: Number,
        standard:  Number,
        large: Number
      },
      type: {
        standard: Number,
        general: Number,
        carpetCleaning: Number,
        afterConstruction: Number,
        officeCleaning: Number,
        furnitureCleaning: Number,
        industrialCleaning: Number,
        poolCleaning: Number
      }
    },
    rate: Number,
    activeStatus: {
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
