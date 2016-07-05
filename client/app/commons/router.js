define(["backbone", "backboneFilter", "backboneSubroute", "jquery", 
          "./model/state", "./model/principal", "./views/loginView"],
  function(Backbone, BackboneFilter, BackboneSubroute, $,
          State, Principal, LoginView ) {

    return Backbone.SubRoute.extend({

      initialize: function() {
        console.log("prefix", this.prefix);
        var self = this;
        _.each(this.before, function(k, v) {
          console.log("key",k,"value",v);
          var _k = self.prefix + '/' + v;
          self.before[_k] = k;
          delete self.before[v];
        });
        console.log('before updated', this.before);
        console.log("common Router started");
      },

      changePage: function(page) {
        $('body').empty();
        $('body').append($(page.el));
        page.render();
      },

 
      /* authentication filter */
      filter: function(fragment, args, next)  {
        // console.log('backbone filter triggered');
        var self = this;
        var principal = new Principal({
          _id: 1
        });
        principal.fetch();
        (new State()).save(null, {
          headers: {
            'x-access-token': principal.get('token')
          },
          success: next,
          error: function(data, res) {
            if (res.status === 403 || res.status === 401) {
              console.log("prefix", this.prefix);
              self.login(fragment);
            }
          }
        });
      },

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

    });
  });