var express = require('express');
var router = express.Router();
var User = require('../model/user');
var bcrypt = require('bcryptjs');
var logger = require('../util/logger');
//var filter = require('../auth/authFilter');

// filter(router); // token auth
router.get('/', function(req, res) {
	User.find(function(err, users) {
		res.set('Content-Type', 'application/json');
		res.send(200, users);
	});
});

router.post('/', function(req, res) {
	if (!req.body.username || !req.body.password) {
		res.json({
			success: false,
			message: 'Please enter username and password.'
		});
	} else {
		var user = new User({
			username: req.body.username,
			password: req.body.password
		});

		// Attempt to save the user
		user.save(function(err) {
			if (err) {
				return res.json({
					success: false,
					message: 'That email address already exists.'
				});
			}
			res.json({
				success: true,
				message: 'Successfully created new user.'
			});
		});
	}

});



module.exports = router;