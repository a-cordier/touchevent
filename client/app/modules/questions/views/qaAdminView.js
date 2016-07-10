define(["backbone", "commons/views/PageView", "commons/viewHolder",
		"underscore", "text",
		"text!../templates/qa-admin.html",
		'../model/qaCollection',
		"jquery", "paginator", "confirmation"
	],
	function(Backbone, PageView, ViewHolder,
		_, text, _template, QaCollection, $) {
		return PageView.extend({


			name: "QaAdminView",

			events: {
				'click .broadcast': 'broadcast',
				'click .edit': 'edit',
				'click .validate': 'validate',
				'click .delete': 'remove',
				'click #power': 'powerSync',
				'click #refresh': 'sync'
			},

			constructor: function(options) {
				PageView.prototype.constructor.apply(this, arguments);
			},

			initialize: function(options) {
				this.qas = options.qas;
				this.listenTo(this.qas,'add', this.add);
				_.bindAll(this, 'render');
				_.bindAll(this, 'add');
				_.bindAll(this, 'remove');
				_.bindAll(this, 'sync');
				this.template = _template;
				this.page = 1;
				this.pages = this.qas.pages;
				this.total = this.qas.total;
				this.waiting = 0;
				this.autoSync = false;
				ViewHolder.registerView(this);
			},


			powerSync: function() {
				this.autoSync = !this.autoSync;
				if (this.autoSync)
					$('#power').removeClass('btn-info').addClass('btn-primary');
				else
					$('#power').removeClass('btn-primary').addClass('btn-info');
			},

			add: function(qa) {
				console.log('add triggered');
				if (!this.autoSync) {
					$('#waiting').html(++this.waiting);
					$('#total').html(this.qas.total);
				} else {
					this.render();
				}
			},

			sync: function(event) {
				this.page = 1;
				this.waiting = 0;
				this.render();
			},

			validate: function(event) {
				var btn = $(event.currentTarget);
				var _id = $(event.currentTarget).attr('data-mngid');
				var qa = this.qas.get(_id);
				if (btn.hasClass('btn-default')) {
					qa.set({
						'state': 'moderated'
					});
					btn.prev('.delete').addClass('disabled').prev('.edit').addClass('disabled');
					btn.removeClass('btn-default').addClass('btn-success');
				} else {
					qa.set({
						'state': 'submitted'
					});
					if (qa.get('onAir')) {
						btn.next('.broadcast').removeClass('btn-danger').addClass('btn-default');
						qa.set({
							'onAir': false
						});
					}
					btn.removeClass('btn-success').addClass('btn-default');
					btn.prev('.delete').removeClass('disabled').prev('.edit').removeClass('disabled');
				}
				btn.next('.broadcast').toggleClass('disabled');
				qa.save();
			},

			broadcast: function(event) {
				var btn = $(event.currentTarget);
				if (btn.hasClass('disabled'))
					return false;
				var qa = this.qas.where({
					_id: btn.attr('data-mngid')
				})[0];
				var toggle = !btn.hasClass('btn-danger');
				var question = "";
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
					btn.siblings('.edit').addClass('disabled');
					question = qa.get('question');
				}
				qa.set('onAir', toggle);
				qa.save();
			},

			edit: function(event) {
				var btn = $(event.currentTarget);
				if (btn.hasClass('disabled'))
					return false;
				var _id = btn.attr('data-mngid');
				var route = 'qa/admin/' + _id;
				Backbone.history.navigate(route, {
					trigger: true
				});
			},

			remove: function(event) {
				console.log('remove triggered');
				var btn = $(event.currentTarget);
				if (btn.hasClass('disabled'))
					return false;
				var self = this;
				btn.confirmation({
					placement: 'left',
					title: 'Êtes vous sûr?',
					btnOkLabel: 'Supprimer',
					btnCancelLabel: 'Annuler',
					singleton: true,
					onConfirm: function() {
						var id = btn.attr('data-mngid');
						self.qas.findWhere({
							_id: id
						}).destroy({
							success: function(model) {
								self.render();
							}
						});
					}
				});
				btn.confirmation('show');
			},

			render: function() {
				this.total = this.qas.total;
				this.pages = this.qas.pages;
				PageView.prototype.render.apply(this, [{
					qas: this.qas.toJSON(),
					total: this.total,
					waiting: this.waiting,
					page: this.page,
					pages: this.pages
				}, {
					detached: true
				}]);
				if (this.autoSync)
					$('#power').removeClass('btn-info').addClass('btn-primary');
				this.qas.each(function(model) {
					if (model.get('state') === 'moderated') {
						var selector = [
							'.validate[data-mngid="',
							model.get('_id'),
							'"]'
						].join('');
						$(selector).removeClass('btn-default').addClass('btn-success');
						$(selector).prev('.delete').addClass('disabled').prev('.edit').addClass('disabled');

					} else {
						var selector = [
							'.broadcast[data-mngid="',
							model.get('_id'),
							'"]'
						].join('');
						$(selector).toggleClass('disabled');
					}
					var selector = [
						'.broadcast[data-mngid="',
						model.get('_id'),
						'"]'
					].join('');
					if (model.get('onAir')) {
						$(selector).removeClass('btn-default').addClass('btn-danger');
						$(selector).siblings('.edit').addClass('disabled');
					}
				});
				var self = this;
				$('#pagination').bootstrapPaginator({
					bootstrapMajorVersion: 3,
					currentPage: self.page,
					totalPages: self.pages,
					onPageClicked: function(e, originalEvent, type, page) {
						self.page = parseInt(page);
						self.render();
					}
				});
				return this;
			}
		});
	});