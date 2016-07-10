define(["backbone", "underscore"],
	function(Backbone, _) {

		return Backbone.Collection.extend({

			initialize: function(options) {
				Backbone.Collection.prototype.initialize.apply(this, arguments);
				this.socket = options.socket;
			},

			constructor: function(attributes, options) {
				Backbone.Collection.prototype.apply(this, arguments);
			},
			bindIo: function(event, callback) {
				this.socket.on(event, function(data) {
					callback(data);
				});
			}


		});
	});