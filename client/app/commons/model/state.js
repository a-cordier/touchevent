define(["backbone"], function(Backbone) {
  
  return Backbone.Model.extend({
    defaults : {},
    idAttribute: "_id",
    initialize: function(){   
    },
    constructor: function (attributes, options) {
        Backbone.Model.apply(this, arguments); // "super" constructor
    },
    validate: function(attr) {
        /* validate attributes example */
        if(attr._id<0) return "Invalid value for ID supplied.";  
    },  
    url : function() {
      return '/api/state'; 
    } 
 
  });
});