define(["backbone", "underscore", "./qa"],
  function(Backbone, _, Qa) {
    return Backbone.Collection.extend({

      model: Qa,

      initialize: function(options) {
        this.limit = 15;
        this.total = 0;
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
        return response.docs;
      },

      add: function(models, options) {
       // SocketIoModel.prototype.add.call(this, models.items, options);
        this.total++;
        console.log('add::total: ' + this.total);
        this.updatePages();
        console.log('add::pages: ' + this.pages);
      },

      remove: function(models, options) {
        //SocketIoModel.prototype.remove.call(this, models.items, options);
        this.total--;
        this.updatePages();
      },

      updatePages: function() {
        this.pages = Math.ceil(this.total / this.limit);
      },

      getTotal: function() {
        return this.total || 0;
      },

      getPages: function()  {
        return this.pages || 1;
      },

      getLimit: function() {
        return this.limit;
      },

      url: '/api/qa'

    });
  });