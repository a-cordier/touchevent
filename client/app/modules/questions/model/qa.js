define([ "backbone", "underscore"], 
  function(Backbone, _) {
  
  return Backbone.Model.extend({
    defaults : {
    },
    idAttribute: "_id",
    initialize: function(){     
    },
    constructor: function (attributes, options) {
        this._id= (attributes && attributes._id) || "";
        Backbone.Model.apply(this, arguments); 
    },
    validate: function(attr) {
        if(attr._id<0) return "Invalid value for ID supplied.";  
    },   
    url : function() {
      return this._id ? '/api/qa/' + this._id : '/api/qa'; 
    } 
 
  });
});