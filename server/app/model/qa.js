var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var qaSchema = new Schema({
  question: String,
  state: String,
  origin: String,
  onAir: {
    type: Boolean,
    default: false
  },
  created_at: Date,
  updated_at: Date
});

qaSchema.plugin(mongoosePaginate);

qaSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  if (!this.state)
    this.state = 'submitted';
  next();
});

var Qa = mongoose.model('Qa', qaSchema);

module.exports = Qa;