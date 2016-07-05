define(["commons/views/PageView", "underscore", "backbone",
    "text", "text!../templates/qa-user.html", "bootstrap",
    "jquery", "validate"
  ],
  function(PageView, _, Backbone, text, _template, bootstrap, $) {
    return PageView.extend({

      template: _template,

      events: {
        'click #submit': 'submit',
        'change textarea': 'inputChanged'
      },

      constructor: function(options) {
        PageView.prototype.constructor.apply(this, arguments);
      },

      initialize: function(options) {
        this.qa = options.qa;
        _.bindAll(this, "inputChanged");
        _.bindAll(this, 'render');
        this.delegateEvents(this.events);
      },

      submit: function() {
        var self = this;
        console.log('handling submission');
        $('#qa-form').validate({
          rules: {
            'question': {
              required: true
            }
          },
          messages: {
            'question': {
              required: "Veuillez saisir votre message."
            }
          },
          highlight: function(element) {
            $('#submit').popover('hide');
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
          },
          success: function(element) {
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
          },
          submitHandler: function(form) {
            self.qa.save(null, {
              success: function(resp, model) {
                console.log('question has been submitted to server');
                $('#qa-form')[0].reset();
                $('.form-group').removeClass('has-success');
                $('#submit').popover('show');
                setTimeout(function(){
                  $('#submit').popover('hide');
                }, 1000);
              }
            });
            return false;
          }
        });
      },

      inputChanged: function(event) {
        if ('question' === $(event.currentTarget).attr('id')) {
          this.qa.set('question', $(event.currentTarget).val());
        }
      },

      render: function() {
        $('body').removeClass('admin-bg').addClass('user-bg');
        PageView.prototype.render.apply(this, [{
          qa: this.qa.toJSON()
        }]);
        return this;
      },
    });
  });