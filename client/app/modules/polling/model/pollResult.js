define(["backbone", "underscore"],
  function(Backbone, _) {

    return Backbone.Model.extend({
      idAttribute: "_id",

      constructor: function(attributes, options) {
        this._id = (attributes && attributes._id) || "";
        Backbone.Model.apply(this, arguments);
      },

      initialize: function() {
        console.log('PollResult has been intialized');
        this.on("invalid", function(model, error) {});
      },

      url: function() {
        return '/api/polls/stats/' + this._id;
      },

    });
  });