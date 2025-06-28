// models/User.js - Updated to include savedPosts and role fields
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: false
  },
  role: {  // Added role field for admin functionality
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  savedPosts: [{  // Added savedPosts array for bookmarking
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;