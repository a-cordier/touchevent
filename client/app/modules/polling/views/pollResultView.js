define(["commons/views/PageView", "underscore",
	"text", "text!../templates/poll-result.html", "../model/pollResult"
], function(PageView, _, text, _template, PollResult) {
	var PollResultView = PageView.extend({

		name: "PollResultView",

		template: _template,

		events: {

		},

		constructor: function(options) {
			PageView.prototype.constructor.apply(this, arguments);
		},

		initialize: function(options) {
			this.poll = new PollResult();
			this.template = _template;
			_.bindAll(this, 'render');
			this.delegateEvents(this.events);
			this.poll.bind('reset', this.render);
		},

		setPollResult: function(pollResult) {
			this.poll.set(pollResult.toJSON());
			this.render();
		},

		render: function() {
			console.log(this.poll.toJSON());
			PageView.prototype.render.apply(this, [{
				poll: this.poll.toJSON()
			}]);
			return this;
		},

	});
	return new PollResultView();
});