var cfg = require('../cfg');
var logger = require('../util/logger');
var Qa = require('../model/qa');
var IoServer = require('../io/ioServer');

var Twitter = require('node-tweet-stream'),
	t = new Twitter({
		consumer_key: cfg.twitterConfig.consumer_key,
		consumer_secret: cfg.twitterConfig.consumer_secret,
		token: cfg.twitterConfig.token,
		token_secret: cfg.twitterConfig.token_secret
	})

t.on('tweet', function(tweet) {
	logger.info("new tweet: " + tweet);
	var qa = new Qa();
	var question = tweet.text.replace(/\S*#(?:\[[^\]]+\]|\S+)/g, '');
	qa.question = question;
	qa.origin = 'twitter';
	qa.save(function(err, _qa) {
		if (err) {
			logger.error(err);
		}
		IoServer.pushQa(_qa);
	});
})

t.on('error', function(err) {
	logger.error(err);
})

module.exports = t;