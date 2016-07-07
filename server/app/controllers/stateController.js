var express = require('express');
var router = express.Router();
var User = require('../model/user');
var logger = require('../util/logger');
//var filter = require('../auth/authFilter');
/* This controller basicaly just sends a ok
if a granted token was provided on request */
// filter(router); // token auth
router.post('/', function(req, res) {
	res.status(200).json({});
});
module.exports = router;