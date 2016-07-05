define(["commons/views/PageView", "underscore",
	"text", "text!../templates/poll-details.html"
], function(PageView, _, text, _template) {
	return PageView.extend({

		template: _template,

		events: {
			'change #polltype input:radio': 'handleTypeChange',
			'click #add-choice-btn': 'handleChoiceAdd',
			'click #rm-choice-btn': 'handleChoiceRemove',
			'click #save': 'save',
			'change #choices input:text': 'handleChoiceEdit',
			'change textarea': 'handleQuestionEdit'
		},

		constructor: function(options) {
			PageView.prototype.constructor.apply(this, arguments);
		},

		initialize: function(options) {
			this.poll = options.poll;
			_.bindAll(this, "handleChoiceEdit");
			_.bindAll(this, "handleTypeChange");
			_.bindAll(this, 'render');
			// this.poll.bind('change', this.render);
			this.delegateEvents(this.events);
		},

		save: function() {
			this.poll.save();
		},


		handleChoiceEdit: function(event) {
			var id = $(event.currentTarget).closest('div[id^=choice-]').attr('id');
			/* getting dict key from id and dict value from val*/
			if (id) {
				var k = id.match(/^.*([A-Z]$)/)[1];
				console.log("choice key", k);
				this.poll.get('choices')[k] = $(event.currentTarget).val();
			}
		},

		handleQuestionEdit: function(event) {
			console.log($(event.currentTarget).attr('id'));
			if ('poll-question-text' === $(event.currentTarget).attr('id')) {
				console.log('question edited');
				this.poll.set('question', $(event.currentTarget).val());
			}
		},

		handleTypeChange: function(event) {
			console.log("pollTypeChanged()");
			console.log($("#polltype input:radio:checked").attr("id"));
			if (this.isCustom()) {
				$('#choices').show();
				this.refreshUiState();
			} else {
				$('#choices').hide();
			}
			this.poll.set('type', $(event.currentTarget).val());
		},

		isCustom: function() {
			return 'custom' === $("#polltype input:radio:checked").attr("id");
		},

		refreshUiState: function() {
			if (this.countCustomChoices() < 3) {
				$('#rm-choice-btn').parent().addClass('disabled');
			}
		},

		handleChoiceAdd: function(event) {
			var lastInput = $('#choices').find('div[id^=choice]').last();
			if (lastInput.length) {
				var id = lastInput.attr('id');
				console.log('last id', id);
				var nextId = this.nextChoiceLetter(id);
				var nextInput = lastInput.clone().attr('id', nextId).insertAfter(lastInput);
				nextInput.find('input').val('').attr('placeholder', 'Saisissez un choix à proposer');
				console.log('next Id', nextId);
			} else {
				console.log('seeding id');
				this.seedId = this.nextChoiceLetter(this.seedId);
				var nextId = this.seedId;
				console.log('next Id', nextId);
				var choices = $('#choices');
				$('<div id="' + nextId + '"></div>').insertBefore(choices.find('span:first'));
				$('#' + nextId).append(
						'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">' +
						'<input type="text">') +
					'</div>';
				$('#' + nextId).find('input').attr('placeholder', 'Saisissez un choix à proposer');
			}
			$('#rm-choice-btn').closest('.ui-state-disabled').removeClass('ui-state-disabled');
		},

		nextChoiceLetter: function(s) {
			return s.replace(/(^.*)([A-Z]$)/, function(str, pre, suf) {
				var c = suf.charCodeAt(0);
				switch (c) {
					case 90:
						return pre + 'A';
					case 122:
						return pre + 'a';
					default:
						return pre + String.fromCharCode(c + 1);
				}
			});
		},


		handleChoiceRemove: function(event) {
			var last = $('#choices').find('input[type=text]').last();
			var div = last.closest('[id^=choice-]');
			var key = div.attr("id").replace(/^.*([A-Z])$/, "$1");
			console.log("key", key);
			this.poll.set("choices", _.omit(this.poll.get("choices"), key));
			last.remove();
			this.refreshUiState();
		},

		countCustomChoices: function() {
			return $('#choices').find('input[type="text"]').length;
		},

		render: function() {
			PageView.prototype.render.apply(this, [{
				poll: this.poll.toJSON()
			}]);
			return this;
		},


		seedId: 'choice-Z'
	});
});