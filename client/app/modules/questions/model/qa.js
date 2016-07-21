define(["backbone", "underscore"],
  function(Backbone, _) {

    return Backbone.Model.extend({
      defaults: {},
      idAttribute: "_id",
      initialize: function() {},
      constructor: function(attributes, options) {
        Backbone.Model.apply(this, arguments);
        this._id = (attributes && attributes._id) || "";
      },
      validate: function(attr) {
        if (attr._id < 0) return "Invalid value for ID supplied.";
      },
      url: function() {
        return this._id ? '/api/qa/' + this._id : '/api/qa';
      }

    });
  });