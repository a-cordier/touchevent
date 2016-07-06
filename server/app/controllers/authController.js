var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../model/user');
var logger = require('../util/logger');
var cfg = require('../cfg');

var router = express.Router();


router.post('/', function(req, res) {
	User.findOne({
		username: req.body.username
	}, function(err, user) {
		if (err) throw err;

		if (!user) {
			logger.error(err);
			res.status(401).send({
				message: 'Authentication failed'
			});
		} else {
			// Check if password matches
			user.comparePassword(req.body.password, function(err, match) {
				if (match && !err) {
					// Create token if the password matched and no error was thrown
					var token = jwt.sign(user.toJSON(), cfg.secret, {
						expiresInMinutes: 1440 // 24h.
					});
					res.cookie('jwt', token, {
						maxAge: 900000,
						httpOnly: true
					})
					res.status(200).send({
						success: true,
						message: 'Token gen.'
					});
				} else {
					res.status(401).send({
						message: 'Authentication failed'
					});
				}
			});
		}
	});
});

module.exports = router;