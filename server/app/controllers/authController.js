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
				user.comparePassword(password, function(err, match) {
					if (match && !err) {
						// Create token if the password matched and no error was thrown
						return done(null, user);
					} else {
						return done(null, false);
					}
				});
			}
		});
	}
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.post('/', function(req, res, next) {
	passport.authenticate('basic', {session:false}, function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).send({
				message: 'authentication failure'
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				logger.error(err);
				return next(err);
			}
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
	})(req, res, next);
});

module.exports = router;