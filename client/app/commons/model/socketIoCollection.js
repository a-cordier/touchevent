define(["backbone", "underscore"],
	function(Backbone, _) {

		return Backbone.Collection.extend({

			initialize: function(options) {
				this.socket = options.socket;
			},

			constructor: function(attributes, options) {
				Backbone.Collection.prototype.constructor.apply(this, arguments);
			},
			add: function(model, options) {
				Backbone.Collection.prototype.add.apply(this, arguments);
			},
			remove: function(model, options) {
				Backbone.Collection.prototype.remove.apply(this, arguments);
			},
			bindIo: function(event, callback) {
				this.socket.on(event, function(data) {
					callback(data);
				});
			}


		});
	});