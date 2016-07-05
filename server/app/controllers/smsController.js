var express = require('express');
var router = express.Router();
var Vote = require('../model/vote');
var Qa = require('../model/qa');
var logger = require('../util/logger');
var XmlStream = require('xml-stream');
var IoServer = require('../io/ioServer');

router.post('/', function(req, res) {
	req.setEncoding('utf8');
	var xml = new XmlStream(req);
	var voter, message;
	xml.on('endElement: MessageText', function(element) {
		message = element.$text.trim();

	});
	xml.on('endElement: From', function(element) {
		voter = element.$text.trim();

	});
	xml.on('end', function() {
		if (new RegExp(/^[0-9]$/).test(message)) {
			/* message is an answer */
			Vote.findOne({
					'vId': 1
						//'vId': message.charAt(0)
				},
				function(err, vote) {
					if (!vote) {
						return res.status(404).send({
							'message': 'not found'
						});
					}
					if (err) {
						return res.status(500).send({
							'error': err
						});
					}
					if (vote.voters.indexOf(voter) < 0) {
						// replaced charAt(1) by charAt(0) (no vid)
						vote.answers.push(message.charAt(0).toUpperCase());
						vote.voters.push(voter);
						vote.save();
						res.status(200).send({
							message: 'vote updated'
						});
					} else {
						res.status(200).send({
							message: 'do not vote twice'
						});
						logger.info(voter + " double voted");
					}

				}
			);
		} else {
			/* message is a question */
			var qa = new Qa();
			qa.question = message;
			qa.origin = 'sms';
			qa.save(function(err, _qa) {
				if (err) {
					logger.error('there was an error on saving a sms message');
					return false;
				} else {
					IoServer.pushQa(_qa);
					res.status(200).send({
							message: 'vote updated'
					});
				}

			});
		}
		//res.end();
	});
});

router.get('/grabber', function(req, res) {
	logger.info(req.query);
	res.status(200).send({
		message: 'received'
	});
});

router.post('/grabber', function(req, res) {
	logger.info(req.body);
	res.status(200).send({
		message: 'received'
	});
});


module.exports = router;