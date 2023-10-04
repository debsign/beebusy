const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'worker' }, // 'admin' or 'worker'
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
