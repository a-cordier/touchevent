define(["backbone", "underscore", "./qa"],
  function(Backbone, _, Qa) {
    return Backbone.Collection.extend({

      model: Qa,

      initialize: function() {
        this.limit = 20;
        var self = this;
        this.on('add', function(model) {

        });
        this.on('remove', function(model) {
          console.log('remove event handled in collection');
        });
        this.on('change', function(model) {});
      },

      comparator: function(q1, q2) {
        return new Date(q2.get("created_at")).getTime() - new Date(q1.get("created_at")).getTime();
      },

      parse: function(response) {
        this.total = response.total;
        this.pages = response.pages;
        console.log("response pages", this.pages);
        return response.docs;
      },

      getTotal: function(){
        return this.total || 0;
      },

      getPages: function() {
        console.log("getPages", this.pages);
        return this.pages || 1;
      },

      getLimit: function() {
        return this.limit;
      },

      url: '/api/qa'

    });
  });