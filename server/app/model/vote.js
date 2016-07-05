var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logger = require('../util/logger');

var voteSchema = new Schema({
  question: String,
  active: { type: Boolean, default: false },
  done: { type: Boolean, default: false },
  vId: Number,
  answers: { type: Array, default: [] },
  voters: { type: Array, default: [] },
  type: String,
  choices: {},
  created_at: Date,
  updated_at: Date
});

// TODO: factorize
voteSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (this.type==='YesNo')
    this.choices = {'A': 'Oui', 'B': 'Non'};
  if (!this.created_at)
    this.created_at = currentDate;
  logger.info('viD: ' + this.vId);
  next();
});

voteSchema.statics.findMax = function(attribute, callback) {
  this.findOne().
    sort('-' + attribute).
    exec(callback);
};

var Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;