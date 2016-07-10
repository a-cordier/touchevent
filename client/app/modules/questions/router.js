/* TODO: require local modules into functions */
define(["backbone", "backboneSubroute", "jquery",
    "commons/io/ioClient",
    "./views/qaSynthView",
    "./views/qaUserView", "./model/qa", "./views/qaDetailsView",
    "./views/qaAdminView", "./views/qaSpeakerView", "./model/qaCollection",

  ],
  function(Backbone, BackboneSubroute, $,
    ioClient,
    QaSynthView, QaUserView, Qa, QaDetailsView,
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
        "regie(/)": "synth",
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
            qas.bindIo("qa-received", function(qa) {
              qas.add(qa, {
                at: 0,
                io: true
              });
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
        var qas = new QaCollection(ioClient);
        qas.fetch({
          data: {
            criteria:  {
              state: "moderated"
            }
          },
          success: function(models) {
            changePage(new QaSpeakerView({
              qas: qas
            }));
            qas.bindIo("qa-validated", function(qa) {
              if (qa.state === 'moderated')
                qas.add(qa, {
                  at: 0,
                  io: true
                });
              else if(qa.state === 'submitted')
                qas.remove(qa);
            });
          },
          error: function(err) {
            console.log(err);
          }
        });
      },

      // synth: function() {
      //   ioClient.join('screen');
      //   ""
      //   this.changePage(QaSynthView);
      //   var qas = new QaCollection();
      //   qas.fetch({
      //     data: {
      //       criteria:  {
      //         onAir: true
      //       }
      //     },
      //     success: function(models) {
      //       console.log(JSON.stringify(models));
      //       if (models.length === 1)
      //         QaSynthView.update(models.toJSON()[0].question);
      //     },
      //     error: function(err) {
      //       console.log(err);
      //     }
      //   });
      // },

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