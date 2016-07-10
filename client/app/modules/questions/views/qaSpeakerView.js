define(["backbone", "commons/views/PageView","commons/viewHolder",
		"underscore", "text",
		"text!../templates/qa-speaker.html",
		'../model/qaCollection'
	],
	function(Backbone, PageView, ViewHolder,
		_, text, _template, QaCollection) {
		var QaListView = PageView.extend({

			name: "QaSpeakerView",
			
			events: {
				'click .broadcast': 'broadcast'
			},

			constructor: function(options) {
				PageView.prototype.constructor.apply(this, arguments);
			},

			initialize: function() {
				this.qas = new QaCollection();
				_.bindAll(this, 'render');
				_.bindAll(this, 'removeModel');
				this.qas.bind('remove', this.render);
				this.qas.bind('add', this.render);
				this.qas.bind('reset', this.render);
				this.template = _template;
				this.delegateEvents(this.events);
				ViewHolder.registerView(this);
			},

			setCollection: function(models) {
				this.qas.reset(models.toJSON());
			},

			addModel: function(model, merge) {
				this.qas.add(model, {
					merge: (merge || false)
				});
			},

      		sync: function(){},
      		
			syncModels: function(model) {
				var self = this;
				this.qas.each(function(model) {
					model.set('onAir', false);
				});
				this.addModel(model, true);
				this.qas.reset(this.qas.models);
			},

			removeModel: function(model) {
				console.log("removeModel()");
				if (model._id) {
					this.qas.set(this.qas.filter(function(qa) {
						return qa.get('_id') !== model._id;
					}));
				} else {
					this.qas.set(this.qas.filter(function(qa) {
						return qa.get('_id') !== model;
					}));
				}
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
		return QaListView;
	});