define(["jquery", "backbone", "underscore", "./loader"],
	function($, Backbone, _, loader) {
		Backbone.$ = $;
		_.templateSettings.variable = "rc";
		$(function() {
			var loading = pleaseWait({
				logo: "img/logo.png",
				backgroundColor: '#aaa',
				loadingHtml: "<div>Chargement...</div>"
			});
			loader.start(function() {
				loading.finish();
				Backbone.history.navigate(Backbone.history.fragment, {
					trigger: true
				});
				Backbone.history.start();
			});
		});
		$.ajaxSetup({
			cache: false,
			statusCode: {
				401: function(req, status, error) {
					console.log(req);
					Backbone.history.navigate('login', {trigger: true});
				}
			}
		});
	});