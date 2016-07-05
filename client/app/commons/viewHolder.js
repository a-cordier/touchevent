define(function() {
	var views = {};
	return {
		getViews: function(){
			return views;
		},
		getView: function(viewName){
			return views[viewName];
		},
		registerView: function(view)  {
			if (view.name === undefined)
				throw "A name attribute is mandatory for the view to be bound";
			views[view.name] = view;
		},

		registerViews: function()  {
			for (var i in arguments) {
				try  {
					this.registerView(arguments[i]);
				} catch (err) {
					throw err;
				}
			}
		}
	};
});