define(["backbone", "underscore", "../router"],
	function(Backbone, _, router) {

		return Backbone.Model.extend({

			initialize: function() {
				options || (options = {});
				this.bind("error", this.defaultErrorHandler);
				this.init && this.init(attributes, options);
			},
			defaultErrorHandler: function(model, error) {
				if (error.status === 401 || error.status === 403) {
					var fragment = Backbone.history.fragment;
					
				}
			}
		});
	});