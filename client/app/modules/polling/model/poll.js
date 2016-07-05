define(["backbone", "underscore"],
	function(Backbone, _) {

		return Backbone.Model.extend({
			defaults: {
				//_id: "",
				question: "",
				active: false,
				done: false,
				// answers: [],
				choices: {},
				answer: '',
				type: "YesNo"
			},
			idAttribute: "_id",
			initialize: function() {
				console.log('Poll has been intialized');
				this.on("invalid", function(model, error) {});
			},
			constructor: function(attributes, options) {
				this._id = (attributes && attributes._id) || "";
				Backbone.Model.apply(this, arguments); // "super" constructor
			},
			validate: function(attr) {
				/* validate attributes example */
				if (attr._id < 0) return "Invalid value for ID supplied.";
			},

			url: function() {
				console.log("url for" + this._id);
				return this._id ? '/api/polls/' + this._id : '/api/polls';
			}

		});
	});