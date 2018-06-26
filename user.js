const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  email:{
    type: String,
    required: true
  },
  token:{
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);