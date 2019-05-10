const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const companySchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  logoURL: {type: String, required: true},
  address: {type: String, required: true},
 // cleaningTypes: {},
  costPerUnit: {
    rooms: {
      bath: {type: Number, required: true},
      standardRoom: {type: Number, required: true},
      largeRoom: {type: Number, required: true}
    },
    types: {
      standard: Number,
      general: Number,
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
});

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Company', companySchema);
