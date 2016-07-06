define([ "underscore", "backbone", "browserStorage"], 
  function(_, Backbone) {
  return Backbone.Model.extend({
    defaults : {},
    blacklist: ['username','password'],
    browserStorage: new Backbone.BrowserStorage.session("principal"),
    idAttribute: "_id",
    validate: function(attr) {
        if(attr._id!=1) return "Invalid value for ID supplied.";  
    },
    toJSON: function(options) {
        return _.omit(this.attributes, this.blacklist);
    }
  });
});