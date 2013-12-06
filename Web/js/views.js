(function(lexterm, undefined) {
	var views = lexterm.views || {};

	views.ServerView = Backbone.View.extend({
	});
	
	views.LexView = Backbone.View.extend({
	});
	
	views.LanguageView = Backbone.View.extend({
		template: Handlebars.compile($('#template-language').html()),
		
		events: {
			'click .submit': this.update,
			'change input': this.change
		},
		
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		
		render: function() {
		   var context = this.model.attributes;
		   context.model = this.model;
		   this.$el.html(this.template(context));
    	   return this;
		},
		
		change: function(evt) {
		   var changed = evt.currentTarget;
	       var value = $(evt.currentTarget).val();
	       this.model.set(changed.id, value);
		},
		
		update: function() {
			this.model.save();
		}
		
	});
	
	views.LexemeView = Backbone.View.extend({
	});
	
	views.CollectionView = Backbone.View.extend({
		tagName : "ul",

		initialize : function() {
			this.template = Handlebars.compile(this.model.listTemplate);
			this.createTemplate = Handlebars.compile(this.model.createTemplate);
		},
		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	lexterm.views = views;
})(window.lexterm = window.lexterm || {}); 