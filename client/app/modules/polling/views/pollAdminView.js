define(["backbone", "commons/views/PageView",
		"underscore", "text",
		"text!../templates/poll-admin.html",

		"jquery"
	],
	function(Backbone, PageView,
		_, text, _template, $) {
		var PollAdminView = PageView.extend({

			events: {
				"click .result": "result"
			},

			constructor: function(options) {
				PageView.prototype.constructor.apply(this, arguments);
			},

			initialize: function(options) {
				this.polls = options.polls;
				this.template = _template;
				this.delegateEvents(this.events);
				_.bindAll(this, "render");
				_.bindAll(this, "result");
			},

			result: function(event) {
				console.log("result()");
				var btn = $(event.currentTarget);
				var _id = btn.attr("data-mngid");
				var route = 'poll/result/' + _id;
				Backbone.history.navigate(route, {
					trigger: true
				});
			},

			render: function() {
				PageView.prototype.render.apply(this, [{
					"polls": this.polls.toJSON()
				}]);
				return this;
			}
		});
		return PollAdminView; // just in case we need a singleton some day
	});