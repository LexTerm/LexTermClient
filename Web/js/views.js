(function(lexterm, undefined){
	var views = {
		ListView: Backbone.View.extend({
			tagName: "ul",
			
			initialize: function() {
				this.template = Handlebars.compile(this.model.listTemplate);
				this.createTemplate = Handlebars.compile(this.model.createTemplate);
			}
			render: function() {
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			}
		})
	}

	lexterm.views = views;
})(window.lexterm = window.lexterm || {});