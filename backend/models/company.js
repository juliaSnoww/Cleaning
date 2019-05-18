const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const companySchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  logo: {type: String},
  address: {type: String, required: true},
  costPerUnit: {
    rooms: {
      bath: {type: Number, required: true},
      standard: {type: Number, required: true},
      large: {type: Number, required: true}
    },
    type: {
      standard: Number,
      general: Number,
      carpetCleaning:Number,
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
