var express = require('express');
var router = express.Router();
var Sched = require('../model/sched');
var logger = require('../util/logger');
var sanitizer = require('../util/sanitizer');

router.get('/', function(req, res) {
	Sched.find(function(err, sched) {
		res.set('Content-Type', 'application/json');
		res.send(200, sched);
	});
});


router.get('/:id', function(req, res) {
	Sched.findOne({
		'_id': req.params.id
	}, function(err, sched) {
		res.set('Content-Type', 'application/json');
		res.send(200, sched);
	});
});
/**
Authenticated REALM
**/

//filter(router); // token auth

router.post('/', function(req, res) {
	var sched = new Sched();
	var badRequest = false;
	if (!req.body.title)
		badRequest = true;
	if (!req.body.start_time)
		badRequest = true;
	if (!req.body.end_time)
		badRequest = true;
	if (badRequest)
		return res.status(400).send({
			message: 'bad request'
		});
	sched.title = sanitizer.escape(req.body.title);
	sched.desc = sanitizer.escape(req.body.desc);
	sched.start_time = req.body.start_time;
	sched.end_time = req.body.end_time;
	if (req.body.speaker)
		sched.speaker = sanitizer.escape(req.body.speaker);
	if (req.body.pic)
		sched.pic = req.body.pic;
	sched.save(function(err) {
		if (err) {
			return res.send(err);
		}
		res.status(201).send({
			message: 'sched added'
		});
	});

});

router.put('/:id', function(req, res) {
	Sched.findOne({
		'_id': req.params.id
	}, function(err, sched) {
		if (!sched)
			return res.status(404).send({
				'message': 'not found'
			});
		if (err)
			return res.status(500).send({
				'error': err
			});
		if (req.body.title)
			sched.title = sanitizer.escape(req.body.title);
		if (req.body.desc)
			sched.desc = sanitizer.escape(req.body.desc);
		if (req.body.start_time)
			sched.start_time = req.body.start_time;
		if (req.body.end_time)
			sched.end_time = req.body.end_time;
		if (req.body.speaker)
			sched.speaker = sanitizer.escape(req.body.speaker);
		if (req.body.pic)
			sched.pic = req.body.pic;
		sched.save(function(err) {
			if (err) {
				return res.send(err);
			}
			res.status(200).send({
				message: 'sched updated'
			});
		});
	});
});

router.delete('/:id', function(req, res) {
	Sched.findOne({
		'_id': req.params.id
	}, function(err, sched) {
		if (!sched)
			return res.status(404).send({
				'message': 'not found'
			});
		if (err)
			return res.status(500).send({
				'error': err
			});
		sched.remove({
			_id: req.params.id
		}, function(err) {

		});
		res.set('Content-Type', 'application/json');
		res.send(204, sched);
	});
});

module.exports = router;