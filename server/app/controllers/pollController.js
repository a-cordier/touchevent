var express = require('express');
var router = express.Router();
var Vote = require('../model/vote');
var logger = require('../util/logger');
var IoServer = require('../io/ioServer');
var filter = require('../auth/authFilter');
var pollControllerHelper = require('../util/pollControllerHelper');

/**
Free zone
**/
router.get('/', function(req, res) {
	Vote.find({},
		'question vId type choices active done',
		function (err, votes) {
		res.set('Content-Type','application/json'); 
		res.send(200, votes); 
	});
});

router.get('/:id', function(req, res) {
	Vote.findOne({'_id':req.params.id},
		'question vId type choices active done',
	    function (err, vote) {
		res.set('Content-Type','application/json'); 
		res.send(200, vote); 
	});
});

/**
Authenticated REALM
**/
//filter(router); 

router.post('/', function(req, res) {
	var badRequest = false;
	if(!req.body.question)
		badRequest = true;
	if(!req.body.type)
		badRequest = true;
	if(req.body.type!=='YesNo' && req.body.type!=='Custom')
		badRequest = true;
	if(req.body.type==='Custom' && ! req.body.choices)
		badRequest = true;
	if(badRequest)
		return res.status(400).send({ message: 'bad request' });
	var vote = new Vote();
	vote.question =  req.body.question;
	vote.choices = req.body.choices;
	vote.type = req.body.type;
	Vote.findOne().sort('-vId').exec(function(err, max){
		if(max != null)
			vote.vId = max.vId + 1;
		else vote.vId = 1; // first insertion
		vote.save(function(err) {
			if (err) 
				return res.send(err);			
			res.status(201).send({ message: 'vote added' });
		});
	});
});

router.put('/:id', function(req, res) {
	Vote.findOne({'_id':req.params.id},
		function (err, vote) { 
		if(!vote){
			logger.info("vote not found");
			return res.status(404).send({'message':'not found'});
		}
		if(err) 
			return res.status(500).send({'error': err});
		if(req.body.active !== undefined) 
			vote.active = req.body.active;
		if(req.body.done !== undefined)
			vote.done = req.body.done;
		if(req.body.question)
			vote.question = req.body.question;
		if(req.body.choices)
			vote.choices = req.body.choices;
		if(req.body.answers)
			vote.answers = req.body.answers;
		if(req.body.voters)
			vote.voters = req.body.voters;
		if(req.body.answer) {
			vote.answers.push(req.body.answer);
			IoServer.updatePollResult({"answer":req.body.answer});
		}
		if(req.body.type)
			vote.type = req.body.type;
		if(req.body.vId)
			vote.vId = req.body.vId;
		vote.save(function(err) {
			if (err) {
				return res.send(err);
			}
			res.status(200).send({ message: 'vote updated' });
		});
	});
});

router.delete('/:id', function(req, res) {
	Vote.findOne({'_id':req.params.id}, function (err, vote) {
		if(!vote)
			return res.status(404).send({'message':'not found'});
	    if(err) 
			return res.status(500).send({'error': err});
		vote.remove({ _id: req.params.id }, function(err){
			Vote.find({
				vId: {$gt: vote.vId}
			}).exec(function(err, votes) { 
				if(err)
					logger.error(err);
				votes.forEach(function(v){
					v.vId = v.vId - 1;
					v.save(function(err){
						if(err)
							logger.error(err);
					});
				});
			});
		});
		res.set('Content-Type','application/json'); 
		res.send(204, {'message':'vote deleted successfully'}); 
	});
});


router.get('/stats/:id', function(req, res) {
	Vote.findOne({'_id':req.params.id}, function (err, vote) {
		res.set('Content-Type','application/json'); 
		var answers = vote.answers;
		var result = {
			question: vote.question,
			stats: [],
			total: 0
		};
		var i=0;
		Object.keys(vote.choices).sort().forEach(function(k){
			result.stats.push({
				"cid": k, 
				"choice": vote.choices[k], 
				"x":++i, 
				"y":0
			});
		});
		answers.forEach(function(answer){
			result.stats.forEach(function(stat){
				if(stat["cid"]===answer) stat["y"]++;
			});
			result["total"]++;
		});
		res.status(200).send(result);
	});
});


module.exports = router;