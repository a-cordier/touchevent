/*
Singleton view letting binding data from the ioClient
*/
define(["backbone", "jquery", "commons/views/PageView", "commons/viewHolder",
    "underscore", "text", "text!../templates/qa-synth.html"
  ],
  function(Backbone, $, PageView, ViewHolder,
    _, text, _template, 
    QaSynthCollection) {
    return PageView.extend({

      name: "QaSynthView",
      
      template: _template,

      events: {},

      constructor: function(options) {
        PageView.prototype.constructor.apply(this, arguments);
      },

      initialize: function(options) {
        this.qas = options.qas;
        this.listenTo(this.qas, 'remove', this.remove);
        this.listenTo(this.qas, 'add', this.add);
        _.bindAll(this, "render");
        _.bindAll(this, "add");
        _.bindAll(this, "remove");
        this.delegateEvents(this.events);
        ViewHolder.registerView(this);
      },

      add: function(model){
        // TODO: transition ?
        this.render();
      },

      remove: function(model){
          $('#synth-content').remove();
      },

      render: function() {
        PageView.prototype.render.apply(this, [{qas: this.qas.toJSON()}]);
        $(this.el).addClass('synth-screen');
        return this;
      }
    });
  });