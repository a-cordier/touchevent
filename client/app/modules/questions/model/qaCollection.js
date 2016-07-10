define(["commons/model/socketIoCollection", "underscore", "./qa"],
  function(SocketIoCollection, _, Qa) {
    return SocketIoCollection.extend({

      model: Qa,

      initialize: function(options) {
        console.log("initializing socket.io collection");
        console.log(arguments);
        SocketIoCollection.prototype.initialize.apply(this, arguments);
        console.log("initialize", this.socket);
        this.limit = 15;
        this.total = 0;
        this.pages = 1;
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
        SocketIoCollection.prototype.add.apply(this, arguments);
        if (options && options.io) {
          this.total++;
          console.log('add::total: ' + this.total);
          this.updatePages();
          console.log('add::pages: ' + this.pages);
        }

      },

      remove: function(models, options) {
        // SocketIoCollection.prototype.remove.call(this, models.items, options);
        this.total--;
        this.updatePages();
      },

      updatePages: function() {
        this.pages = Math.ceil(this.total / this.limit);
        if (this.pages === 0)
          this.pages = 1;
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