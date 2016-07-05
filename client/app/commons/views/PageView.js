define(["backbone", "jquery", "underscore"], function(Backbone, $, _) {
  return Backbone.View.extend({

    template: "",

    _template: function(item) {
      return _.template(this.template)(item);
    },

    render: function(item, options) {
      this.$el.empty();
      if (options && options.detached) {
        this.delegateEvents(this.events);
      } 
      this.$el.append(this._template(item));
      return this;
    }
  });
});