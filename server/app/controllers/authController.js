var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../model/user');
var logger = require('../util/logger');
var cfg = require('../cfg');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy
var router = express.Router();


passport.use(new BasicStrategy(
	function(username, password, done) {
		User.findOne({
			username: username
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			} else {
				// Check if password matches
				user.comparePassword(req.body.password, function(err, match) {
					if (match && !err) {
						// Create token if the password matched and no error was thrown
						var token = jwt.sign(user, cfg.secret, {
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
						return done(null, user);
					} else {
						return done(null, false);
					}
				});
			}
		});
	}
));

router.post('/',
	passport.authenticate('basic', {
		session: false
	}),
	function(req, res) {
		var token = jwt.sign(user, cfg.secret, {
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
});
// router.post('/', function(req, res) {
// 	User.findOne({
// 		username: req.body.username
// 	}, function(err, user) {
// 		if (err) throw err;

// 		if (!user) {
// 			logger.error(err);
// 			res.status(401).send({
// 				message: 'Authentication failed'
// 			});
// 		} else {
// 			// Check if password matches
// 			user.comparePassword(req.body.password, function(err, match) {
// 				if (match && !err) {
// 					// Create token if the password matched and no error was thrown
// 					var token = jwt.sign(user, cfg.secret, {
// 						expiresInMinutes: 1440 // 24h.
// 					});
// 					res.cookie('jwt', token, {
// 						maxAge: 900000,
// 						httpOnly: true
// 					})
// 					res.status(200).send({
// 						success: true,
// 						message: 'Token gen.'
// 					});
// 				} else {
// 					res.status(401).send({
// 						message: 'Authentication failed'
// 					});
// 				}
// 			});
// 		}
// 	});
// });

module.exports = router;