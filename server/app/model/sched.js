var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schedSchema = new Schema({
  title: String,
  desc: String,
  speaker: String,
  pic: String,
  start_time: Date,
  end_time: Date,
  created_at: Date,
  updated_at: Date
});


schedSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

var Sched = mongoose.model('Sched', schedSchema);

module.exports = Sched;