const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  cleaningService_id: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  imagePath: String,
  text: String,
  date: Date,
  rate: Number
});

module.exports = mongoose.model('Comments', commentSchema);
