var express = require('express');
var router = express.Router();
var User = require('../model/user');
var bcrypt = require('bcryptjs');
var logger = require('../util/logger');
var filter = require('../auth/authFilter');

filter(router); // token auth
router.get('/', function(req, res) {
	User.find(function (err, users) {
		res.set('Content-Type','application/json'); 
		res.send(200, users); 
	});
});

router.post('/', function(req, res) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, hash) {
			if(err)
				logger.error('bcrypt error: ' + err);
			logger.info('hash: ' + hash);
			var user = new User();
			user.password=hash;
			user.username=req.body.username;
			logger.info('username: ' + user.username);
			user.admin=req.body.admin;
			user.save(function(err) {
				if (err) {
					logger.error(err);
					return res.send(err);
				}
				res.status(201).send({ message: 'user added' });
			});
		});
	});

});



module.exports = router;