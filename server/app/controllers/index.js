var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var cfg = require('../cfg');

mongoose.connect(cfg.database);

router.use('/polls', require('./pollController'));
router.use('/scheds', require('./schedController'));
router.use('/users', require('./userController'));
router.use('/auth', require('./authController'));
router.use('/state', require('./stateController'));
router.use('/qa', require('./qaController'));
router.use('/sms', require('./smsController'));
module.exports = router;