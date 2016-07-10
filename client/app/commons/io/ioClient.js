define(['backbone',
		'text', 'json!config/cfg.json',
		'socketio', 'jquery'
	],
	function(Backbone,
		text, cfg,
		io, $) {

		'use strict';

		var instance = null;

		function Socket() {
			var url = 'http://' + cfg.host;
			this.socket = io(url, {
				'reconnect': true,
				'reconnectionDelay': 100,
				'reconnectionDelayMax': 100
			});

			var self = this;

			this.socket.on('connect', function() {
	
			});
		}

		Socket.prototype.join = function(room) {
			this.socket.emit('join', room);
		};

		function getInstance() {
			instance = instance || new Socket();
			return instance;
		}

		return getInstance();
	});