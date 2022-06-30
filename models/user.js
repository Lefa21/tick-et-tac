var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
    name: String ,
    FirstName: String ,
    email: String,
    password: String,
  });

  

  var userModel = mongoose.model('users', userSchema);

  module.exports = userModel;