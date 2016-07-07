define(["backbone", "backboneSubroute", "jquery",
    "./model/principal", "./views/loginView"
  ],
  function(Backbone, BackboneSubroute, $,
    Principal, LoginView) {

    return Backbone.SubRoute.extend({

      routes: {
        "": "login"
      },

      initialize: function() {},

      /* redirect to login page 
       * @param callbackUrl: login success callback url
       */
      login: function(resource) {
        var principal = new Principal({
          _id: 1
        });
        principal.set('resource', resource);
        this.changePage(new LoginView({
          'principal': principal
        }));
      },

      changePage: function(page) {
        $('body').empty();
        $('body').append($(page.el));
        page.render();
      },


    });
  });