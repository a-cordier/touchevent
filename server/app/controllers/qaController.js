"use strict";

var express = require('express');
var router = express.Router();
var Qa = require('../model/qa');
var logger = require('../util/logger');
var IoServer = require('../io/ioServer');
var filter = require('../auth/authFilter');
var sanitizer = require('../util/sanitizer');


router.get('/', require('../auth/authFilter'), function(req, res, next) {
	logger.info("get qa");
	var page = req.query.page || 1;
	var limit = req.query.limit || 20;
	var criteria = req.query.criteria || {};
	logger.info('getting qas - ', 'page:', page, ', limit:', limit);
	Qa.paginate(criteria, {
		'page': parseInt(page),
		'limit': parseInt(limit),
		'sort': {
			created_at: -1
		}
	}, function(err, result) {
		res.set('Content-Type', 'application/json');
		res.send(200, result);
	});

});

router.get('/:id', function(req, res) {
	Qa.findOne({
		'_id': req.params.id
	}, function(err, qa) {
		res.set('Content-Type', 'application/json');
		res.send(200, qa);
	});
});
/**
Authenticated REALM
**/
//filter(router); 

router.post('/', function(req, res) {
	if (!req.body.question)
		return res.status(400).send({
			message: 'bad request'
		});
	var qa = new Qa();
	qa.question = sanitizer.escape(req.body.question);
	qa.origin = 'webapp';
	qa.save(function(err, _qa) {
		if (err) {
			logger.error(err);
			return res.send(err);
		}
		res.status(200).send({
			message: 'Qa added'
		});
		IoServer.pushQa(_qa);
	});
});

router.put('/:id', function(req, res) {
	Qa.findOne({
		'_id': req.params.id
	}, function(err, qa) {
		if (!qa)
			return res.status(404).send({
				'message': 'not found'
			});
		if (err)
			return res.status(500).send({
				'error': err
			});
		logger.info('qa state ' + qa.state);
		logger.info('req state ' + req.body.state);
		if (qa.state !== req.body.state) {
			if (req.body.state === 'submitted' || req.body.state === 'moderated') {
				qa.state = req.body.state;
				IoServer.validateQa(qa);
			}
		} else if (req.body.state)
			qa.state = req.body.state;
		if (req.body.question)
			qa.question = req.body.question;
		if (qa.onAir === false && req.body.onAir === true) {
			qa.onAir = req.body.onAir;
			IoServer.synthTransition({
				'question': qa.question,
				'qa': qa
			});
		} else if (qa.onAir === true && req.body.onAir === false) {
			qa.onAir = req.body.onAir;
			IoServer.synthTransition({
				'qa': qa,
				'question': undefined
			});
		}
		qa.save(function(err) {
			if (err) {
				return res.send(err);
			}
			res.status(200).send({
				message: 'Qa updated'
			});
		});
	});
});

router.delete('/:id', function(req, res) {
	Qa.findOne({
		'_id': req.params.id
	}, function(err, qa) {
		if (!qa)
			return res.status(404).send({
				'message': 'not found'
			});
		if (err)
			return res.status(500).send({
				'error': err
			});
		qa.state = 'deleted';
		qa.onAir = false;
		qa.save(function(err) {
			if (err) {
				return res.send(err);
			}
			res.status(200).send({
				message: 'Qa deleted'
			});
		});
	});
});

module.exports = router;