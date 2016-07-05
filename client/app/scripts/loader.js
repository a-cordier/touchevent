define(["underscore", "text", "json!config/cfg.json"], function(_, text, manifest) {
	console.log(manifest.name);
	console.log(manifest.description);
	var n = _.keys(manifest.modules).length;
	console.log(n, "modules");
	var load = function(moduleId, callback) {
		var module = manifest.modules[moduleId];
		try {
			require([manifest.modulesProvider + "/" + moduleId + "/router"], function(Router) {
				new Router(module.path);
				if (--n === 0){
					callback();
				} 

			});
		} catch (err) {
			throw "Dependency error for module " + moduleId + " (" + err + ")";
		}
	};
	return {
		start: function(callback) {
			_.each(_.keys(manifest.modules), function(moduleId) {
				try {
					load(moduleId, callback);
				} catch (err) {
					console.log("Loading error: " + err);
				}
			});
		}
	};

});