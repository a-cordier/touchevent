/* TODO: require local modules into functions */
define(["backbone", "backboneSubroute", "jquery",
    "commons/io/ioClient",
    "./views/qaScreenView",
    "./views/qaUserView", "./model/qa", "./views/qaDetailsView",
    "./views/qaAdminView", "./views/qaSpeakerView", "./model/qaCollection",

  ],
  function(Backbone, BackboneSubroute, $,
    ioClient,
    QaScreenView, QaUserView, Qa, QaDetailsView,
    QaAdminView, QaSpeakerView, QaCollection
  ) {

    var changePage = function(page) {
      $('body').empty();
      $('body').append($(page.el));
      page.render();
    };

    return BackboneSubroute.extend({

      initialize: function() {
        console.log("starting router: questions");
      },

      routes: {
        "admin(/)": "adminQas",
        "admin/:id": "adminQa",
        "speaker(/)": "speaker",
        "screen(/)": "screen",
        "(/)": "qa",
        "": "qa"
      },

      adminQas: function() {
        ioClient.join('admin');
        console.log('routeur::socket', ioClient.socket);
        var self = this;
        var qas = new QaCollection({
          socket: ioClient.socket
        });
        qas.fetch({
          data: {
            criteria: {
              $or: [{
                state: 'moderated'
              }, {
                state: 'submitted'
              }]
            },
            resource: Backbone.history.fragment,
            page: qas.page,
            limit: qas.limit,
          },
          success: function(qas) {
            changePage(new QaAdminView({
              qas: qas
            }));
            qas.bindIo("qa:new", function(qa) {
              qas.add(qa, {
                at: 0,
                io: true
              });
            });
            qas.bindIo("qa:state", function(qa) {
              console.log("qa:state rceived");
              qas.findWhere({
                _id: qa._id
              }).set('state', qa.state);
            });
            qas.bindIo("qa:onair", function(qa) {
              qas.findWhere({
                _id: qa._id
              }).set('onAir', qa.onAir);
            });
            qas.bindIo("qa:destroy", function(qa) {
              qas.remove(qas.findWhere({
                _id: qa._id
              }));
            });
          }
        });
      },

      /* Creates a new vote or edit vote depending on id */
      adminQa: function(id) {
        ioClient.join('admin');
        var self = this;
        var qa = new Qa({
          _id: id
        });
        qa.fetch({
          success: function() {
            self.changePage(new QaDetailsView({
              "qa": qa
            }));
          }
        });
      },

      speaker: function() {
        ioClient.join('speaker');
        var self = this;
        var qas = new QaCollection({
          socket: ioClient.socket
        });
        qas.fetch({
          data: {
            criteria:  {
              state: "moderated"
            },
            resource: Backbone.history.fragment
          },
          success: function(models) {
            changePage(new QaSpeakerView({
              qas: qas
            }));
            qas.bindIo("qa:state", function(qa) {
              if (qa.state === 'moderated')
                qas.add(qa, {
                  at: 0,
                  io: true
                });
              else if (qa.state === 'submitted') {
                qas.remove(qas.findWhere({
                  _id: qa._id
                }));
              }
            });
            qas.bindIo("qa:onair", function(qa) {
              qas.findWhere({
                _id: qa._id
              }).set('onAir', qa.onAir);
            });
            qas.bindIo("qa:destroy", function(qa) {
              qas.remove(qas.findWhere({
                _id: qa._id
              }));
            });
          },
          error: function(err) {
            console.log(err);
          }
        });
      },

      screen: function() {
        ioClient.join('screen');
        var qas = new QaCollection({
          socket: ioClient.socket
        });
        qas.fetch({
          data: {
            criteria:  {
              onAir: true
            },
            resource: Backbone.history.fragment
          },
          success: function(models) {
            changePage(new QaScreenView({
              qas: qas
            }));
            qas.bindIo("qa:onair", function(qa) {
              qas.remove(qas.findWhere({
                _id: qa._id
              }));
              if (qa.onAir) {
                qas.add(qa);
              }
            });
          },
          error: function(err) {
            console.log(err);
          }
        });
      },

      qa: function() {
        ioClient.join('user');
        var self = this;
        var qa = new Qa();
        self.changePage(new QaUserView({
          "qa": qa
        }));
      },

      changePage: function(page) {
        $('body').empty();
        $('body').append($(page.el));
        page.render();
      },

    });
  });