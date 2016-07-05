define(["backbone", "underscore", "./poll"],
	function(Backbone, _, Poll) {
		return Backbone.Collection.extend({

			model: Poll,

			initialize: function() {
				this.on('add', function(model) {});

				this.on('remove', function(model) {});

				this.on('change', function(model) {});
			},

			comparator: function(poll) {
				return poll.get('vId');
			},

			getActive: function(callbacks) {
				var active = this.filter(function(poll) {
					return poll.get("active");
				});
				var notFound = active.length === 0 ||
					typeof active === 'undefined' ||
					active === null;
				if (notFound && callbacks["error"]) {
					callbacks['error']("not found");
				} else if (notFound === false) {
					callbacks['success'](active[0]);
				}
			},

			getOpen: function(callbacks) {
				var open  = this.filter(function(poll) {
					return !poll.get("done");
				});
				callbacks['success'](open);			
			},

			getClosed: function(callbacks) {
				var closed = this.filter(function(poll) {
					return poll.get("done");
				});
				callbacks['success'](closed);			
			},

			url: '/api/polls'

		});
	});