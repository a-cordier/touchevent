var Helper = {
	toResult: function(poll){
		var answers = poll.answers;
		var result = {
			question: poll.question,
			stats: [],
			total: 0
		};
		var i=0;
		Object.keys(poll.choices).sort().forEach(function(k){
			result.stats.push({
				"cid": k, 
				"choice": poll.choices[k], 
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
		return result;
	}
};

module.exports = Helper;