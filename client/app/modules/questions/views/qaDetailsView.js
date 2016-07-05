define(["commons/views/PageView", "underscore",
    "text", "text!../templates/qa-details.html"
  ],
  function(PageView, _, text, _template) {
    return PageView.extend({

      template: _template,

      events: {
        'click #save': 'save',
        'change textarea': 'editQuestion'
      },

      constructor: function(options) {
        PageView.prototype.constructor.apply(this, arguments);
      },

      initialize: function(options) {
        this.qa = options.qa;
        _.bindAll(this, 'render');
        _.bindAll(this, 'save');
        this.delegateEvents(this.events);
      },

      save: function() {
        this.qa.save();
      },

      editQuestion: function(event) {
        this.qa.set('question', $(event.currentTarget).val());
      },

      render: function() {
        $('body').removeClass('user-bg').addClass('admin-bg');
        PageView.prototype.render.apply(this, [{
          qa: this.qa.toJSON()
        }]);
        return this;
      }
    });
  });