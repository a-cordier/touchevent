requirejs.config({
	baseUrl: '../lib',
	paths: {
		jquery: 'jquery/jquery.min',
		underscore: 'underscore',
		text: 'text',
		backbone: 'backbone-min',
		browserStorage: 'backbone.browserStorage',
		backboneFilter: 'backbone-route-filter',
		backboneSubroute: 'backbone.subroute.min',
		socketio: 'socket.io',
		moment: 'moment.min',
		validate: 'jquery/jquery.validate.min',
		bootstrap: 'bootstrap/js/bootstrap',
		paginator: 'bootstrap/plugins/bootstrap-paginator.min',
		confirmation: 'bootstrap/plugins/bootstrap-confirmation',
		modules: '../modules',
		commons: '../commons',
		config: '../config',
		scripts: '../scripts'
	},

	waitSeconds: 60,
	shim: {
		'validate': {
			'deps': ['jquery']
		},
		'paginator': {
			'deps': ['jquery']
		},
		'bootstrap': {
			'deps': ['jquery']
		},
		'confirmation': {
			'deps': ['jquery','bootstrap']
		}	
	}
});

require(["scripts/index"], function() {
	console.log("application started");
});