define(['backbone', 'commons/viewHolder',
		'text', 'json!config/cfg.json',
		'socketio', 'jquery'
	],
	function(Backbone, ViewHolder,
		text, manifest,
		io, $) {

		'use strict';

		var instance = null;

		function Socket() {
			var url = 'http://' + manifest.host;
			this.socket = io(url, {
				'reconnect': true,
				'reconnectionDelay': 100,
				'reconnectionDelayMax': 100
			});
		//	this.views = {};

			var self = this;

			this.socket.on('connect', function() {
				// self.socket.on('qa-validated', function(qa) {
				// 	var fragment = Backbone.history.fragment;
				// 	if (fragment.indexOf('speaker') !== -1) {
				// 		if (qa.state === 'moderated') {
				// 			//self.views.QaSpeakerView.addModel(qa);
				// 			ViewHolder.getView('QaSpeakerView').addModel(qa);
				// 		} else if (qa.state === 'submitted') {
				// 			ViewHolder.getView('QaSpeakerView').removeModel(qa);
				// 			//self.views.QaSpeakerView.removeModel(qa);
				// 		}
				// 	} else if (fragment.indexOf('qa/admin') !== -1) {
				// 		ViewHolder.getView('QaAdminView').sync();
				// 		//self.views.QaAdminView.sync();
				// 	}
				// });
				// self.socket.on('qa-received', function(qa) {
				// 	console.log('qa-received');
				// 	ViewHolder.getView('QaAdminView').getCollection().add(qa, {
				// 		at: 0
				// 	});
				// });
				self.socket.on('qa-deleted', function(id) {
					var fragment = Backbone.history.fragment;
					if (fragment.indexOf('speaker') !== -1)
						ViewHolder.getView('QaSpeakerView').removeModel(id);
						//self.views.QaSpeakerView.removeModel(id);
					else if (fragment.indexOf('admin/qa') !== -1)
						ViewHolder.getView('QaAdminView').sync();
						//self.views.QaAdminView.sync();
				});
				self.socket.on('synth-transition', function(data) {
					var fragment = Backbone.history.fragment;
					if (fragment.indexOf('regie') !== -1)
						ViewHolder.getView('QaSynthView').update(data.question);
						//self.views.QaSynthView.update(data.question);
					if (fragment.indexOf('qa/speaker') !== -1) {
						ViewHolder.getView('QaSpeakerView').syncModels(data.qa);
						//self.views.QaSpeakerView.syncModels(data.qa);
					} else if (fragment.indexOf('qa/admin') !== -1) {
						ViewHolder.getView('QaAdminView').sync();
						//self.views.QaAdminView.sync();
					}

				});
				self.socket.on('poll-updated', function(data) {
					var fragment = Backbone.history.fragment;
					if (fragment.indexOf('poll/result') !== -1) {
						//console.log(JSON.stringify(data));
					}

				});

			});
		}

		Socket.prototype.join = function(room) {
			this.socket.emit('join', room);
		};


		// Socket.prototype.registerView = function(view)  {
		// 	if (view.name === undefined)
		// 		throw "A name attribute is mandatory for the view to be bound";
		// 	this.views[view.name] = view;
		// };

		// Socket.prototype.registerViews = function()  {
		// 	for (var i in arguments) {
		// 		try {
		// 			this.registerView(arguments[i]);
		// 		} catch(err) {
		// 			throw err;
		// 		}
		// 	}
		// };

		function getInstance() {
			instance = instance || new Socket();
			return instance;
		}

		return getInstance();
	});