const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  type: {type: String, required: true},
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
      cleaningDate: Date,
      preferredTime: String,
      regularity: String,
      activityInfo: {
        status: String,
        reason: String
      }
    }
  },
  company: {
    logo: String,
    address: String,
    description: String,
    cleaningTypeArray: Array,
    costPerUnit: {
      rooms: {
        bath: Number,
        standard: Number,
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
  },
  activeStatus: {
    status: Boolean,
    reason: String
  }

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
