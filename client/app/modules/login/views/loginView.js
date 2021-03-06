define(["backbone", "jquery", "bootstrap", "commons/views/PageView",
    "underscore", "text", "text!../templates/login.html"
  ],
  function(Backbone, $, bootstrap, PageView, _, text, _template) {
    return PageView.extend({

      template: _template,

      events: {
        'change input': 'inputChanged',
        'click #auth': 'auth'
      },

      constructor: function(options) {
        PageView.prototype.constructor.apply(this, arguments);
      },

      initialize: function(options) {
        this.principal = options.principal;
        this.resource = this.principal.get("resource");
        _.bindAll(this, "render");
        _.bindAll(this, "auth");
        this.delegateEvents(this.events);
      },

      inputChanged: function(event) {
        var id = $(event.currentTarget).attr('id');
        if (id === "username") {
          this.principal.set('username', $(event.currentTarget).val());
        }
        if (id === "password") {
          this.principal.set('password', $(event.currentTarget).val());
        }
      },

      auth: function(event) {
        console.log('trigger auth');
        var self = this;
        Backbone.ajax({
          type: "GET",
          url: "/api/auth",
          xhrFields: {
            withCredentials: true
          },
          headers: {
            'Authorization': 'Basic ' + btoa(self.principal.get("username")+':'+self.principal.get("password"))
          },
          data: {
            "resource": self.resource
          },
          success: function(res) {
            Backbone.history.navigate(self.resource, {trigger:true});
          }
        });

      },

      render: function() {
        PageView.prototype.render.apply(this, [{
          "principal": this.principal
        }]);
        return this;
      }
    });
  });