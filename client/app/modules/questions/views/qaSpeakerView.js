define(["backbone", "commons/views/PageView", "commons/viewHolder",
		"underscore", "text",
		"text!../templates/qa-speaker.html",
		'../model/qaCollection'
	],
	function(Backbone, PageView, ViewHolder,
		_, text, _template, QaCollection) {
		return PageView.extend({

			name: "QaSpeakerView",

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
				_.bindAll(this, 'render');
				_.bindAll(this, 'remove');
				_.bindAll(this, 'add');
				this.qas.bind('reset', this.render);
				this.template = _template;
				this.delegateEvents(this.events);
				ViewHolder.registerView(this);
			},

			setCollection: function(models) {
				this.qas.reset(models.toJSON());
			},

			add: function(model, merge) {
				console.log('trigger add');
				this.render();
			},


			remove: function(model) {
				console.log('trigger remove')
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