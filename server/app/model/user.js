var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var Roles = require('../auth/roles');
/**
User model object is 
used to determine whether 
logged in user is admin or not
**/
var userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: [Roles.admin.id, Roles.member.id],
    default: Roles.member.id
  },
  created_at: Date,
  updated_at: Date,
  registered_at: Date
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.registered_at)
    this.registered_at = currentDate;
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function(pw, callback) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

var User = mongoose.model('User', userSchema);

module.exports = User;