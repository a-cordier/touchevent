/* TODO: require local modules into functions */
define(["backbone", "backboneFilter", "commons/router", "jquery",
   // "commons/io/ioClient",
    "./model/poll", "./views/pollDetailsView",
    "./model/pollCollection", "./views/pollAdminView",
    "./model/pollResult", "./views/pollResultView"
  ],
  function(Backbone, BackboneFilter, BaseRouter, $,
   // ioClient,
    Poll, PollDetailsView, PollCollection, PollAdminView, PollResult, PollResultView
  ) {

    return BaseRouter.extend({

      initialize: function() {
        BaseRouter.prototype.initialize.apply(this, arguments);
      //  ioClient.registerViews(PollResultView);
      },

      routes: {
        "admin(/)": "adminPolls",
        "admin/:id": "adminPoll",
        "result/:id": "result",
        "": "poll"
      },

      before: {
        "admin(/)": "filter",
        "admin/:id": "filter"
      },

      /* Creates a new vote or edit vote depending on id */
      adminPoll: function(id) {
        var self = this;
        if ('new' === id) {
          var poll = new Poll();
          self.changePage(new PollDetailsView({
            "poll": poll
          }));
        } else {
          var poll = new Poll({
            _id: id
          });
          poll.fetch({
            success: function() {
              self.changePage(new PollDetailsView({
                "poll": poll
              }));
            }
          });
        }
      },

      adminPolls: function() {
        var self = this;
        var polls = new PollCollection();
        polls.fetch({
          success: function(models) {
            self.changePage(new PollAdminView({"polls":polls}));
          }
        });
      },

      result: function(id) {
        console.log("result()");
        var self = this;
        var poll = new PollResult({
          _id: id
        });
        poll.fetch({
          success: function() {
            self.changePage(PollResultView);
            PollResultView.setPollResult(poll);
          }
        });
      },

      poll: function() {
        console.log("poll() triggered");
      }

    });
  });