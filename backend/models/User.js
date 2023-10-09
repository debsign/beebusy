const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'worker' }, // 'admin' or 'worker'
  avatar: { type: String, default: 'default' },
  alerts: [AlertSchema],
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
