var mongoose = require('mongoose');


var tripSchema = mongoose.Schema({
    date: Date,
    departure: String,
    departureTime: String,
    price: Number,
  });

var userSchema = mongoose.Schema({
    name: String ,
    FirstName: String ,
    email: String,
    password: String,
    trips: [tripSchema],
  });

  

  var userModel = mongoose.model('users', userSchema);

  module.exports = userModel;