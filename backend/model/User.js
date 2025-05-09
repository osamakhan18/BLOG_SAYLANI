const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile: { type: String, required: false },  // Make profile optional
  id: { type: String, required: false },
  createAt:{
    type:Date,
    default:Date.now

  }       
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
