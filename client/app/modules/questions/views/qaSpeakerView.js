define(["backbone", "commons/views/PageView",
		"underscore", "text",
		"text!../templates/qa-speaker.html",
		'../model/qaCollection'
	],
	function(Backbone, PageView,
		_, text, _template, QaCollection) {
		return PageView.extend({



			events: {
				'click .broadcast': 'broadcast'
			},

			constructor: function(options) {
				PageView.prototype.constructor.apply(this, arguments);
			},

			initialize: function(options) {
				this.qas = options.qas;
				this.listenTo(this.qas, 'add', this.add);
				this.listenTo(this.qas, 'remove', this.remove);
				this.listenTo(this.qas, 'change', this.render);
				_.bindAll(this, 'render');
				_.bindAll(this, 'remove');
				_.bindAll(this, 'add');
				this.template = _template;
				this.delegateEvents(this.events);
			},

			add: function(model, merge) {
				this.render();
			},

			remove: function(model) {
				this.render();
			},

			broadcast: function(event) {
				var btn = $(event.currentTarget);
				var qa = this.qas.where({
					_id: btn.attr('data-mngid')
				})[0];
				var toggle = !btn.hasClass('btn-danger');
				if ($('.broadcast.btn-danger').length > 0) {
					var _qa = this.qas.where({
						_id: $('.broadcast.btn-danger').attr('data-mngid')
					})[0];
					_qa.set('onAir', false);
					_qa.save();
					$('.broadcast.btn-danger').removeClass('btn-danger').addClass('btn-default');
				}
				if (toggle) {
					btn.removeClass('btn-default').addClass('btn-danger');
				}
				qa.set('onAir', toggle);
				qa.save();
			},

			render: function() {
				PageView.prototype.render.apply(this, [{
					qas: this.qas.toJSON()
				}]);
				this.qas.each(function(model) {
					var selector = [
						'.broadcast[data-mngid="',
						model.get('_id'),
						'"]'
					].join('');
					if (model.get('onAir')) {
						$(selector).removeClass('btn-default').addClass('btn-danger');
					}
				});
				return this;
			}
		});
	});