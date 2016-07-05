var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
User model object is 
used to determine whether 
logged in user is admin or not
**/
var userSchema = new Schema({
  username: String,
  password: String,
  admin: Boolean,
  created_at: Date,
  registered_at: Date
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.registered_at)
    this.registered_at = currentDate;
  next();
});

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

var User = mongoose.model('User', userSchema);

module.exports = User;