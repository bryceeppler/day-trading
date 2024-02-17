const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema({
  user_id: { type: ObjectId, unqiue: true}, //required?
  user_name: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true}, 
  balance: {type: Number}, //required?
});

const User = mongoose.model('User', userSchema);

module.exports = User;