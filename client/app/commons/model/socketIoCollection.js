define(["backbone", "underscore"],
	function(Backbone, _) {

		return Backbone.Collection.extend({

			initialize: function(options) {
				Backbone.Collection.initialize.apply(this, arguments);
				this.socket = options.socket;
			},

			constructor: function(attributes, options) {
				Backbone.Collection.apply(this, arguments);
			},
			bindIo: function(event, callback) {
				this.socket.on(event, function(data) {
					callback(data);
				});
			}


		});
	});