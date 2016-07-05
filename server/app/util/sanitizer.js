var validator = require('validator');

var Sanitizer = {
	isObject: function(input) {
		return input !== null && typeof input === 'object';
	},
	escape: function(input) {
		if(this.isObject(input)){
			for(k in input) {
				var val = input[k];
				if (typeof val === 'string' || val instanceof String)
					input[k] = validator.escape(val);
			}
			return input;
		}
		else return validator.escape(input);
	}
};

module.exports = Sanitizer;