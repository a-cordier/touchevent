define(["backbone", "underscore"],
	function(Backbone, _) {

		return Backbone.Model.extend({
			initialize: function(options) {
				this.socket = options.socket;
			},
			constructor: function(attributes, options) {
				Backbone.Model.apply(this, arguments);
			},
			validate: function(attr) {
				if (attr._id < 0) return "Invalid value for ID supplied.";
			},
			bindIo: function(event, callback) {
				this.socket.on(event, function(data) {
					callback(data);
				});
			}
		});
	});