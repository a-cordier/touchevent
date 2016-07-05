/*
Singleton view letting binding data from the ioClient
*/
define(["backbone", "jquery", "commons/views/PageView", "commons/viewHolder",
    "underscore", "text", "text!../templates/qa-synth.html"
  ],
  function(Backbone, $, PageView, ViewHolder,
    _, text, _template, 
    QaSynthCollection) {
    var SynthView = PageView.extend({

      name: "QaSynthView",
      
      template: _template,

      events: {},

      constructor: function(options) {
        PageView.prototype.constructor.apply(this, arguments);
      },

      initialize: function(options) {
        _.bindAll(this, "render");
        _.bindAll(this, "update");
        this.delegateEvents(this.events);
        ViewHolder.registerView(this);
      },

      sync: function(){},
      
      update: function(data) {
        if(!data)
          data = "";
        $('#synth').html('<p>QUESTION: ' + data + '</p>');
      },

      render: function() {
        PageView.prototype.render.apply(this, []);
        $(this.el).addClass('synth-screen');
        return this;
      }
    });
    return new SynthView();
  });