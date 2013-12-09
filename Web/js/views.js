(function(lexterm, undefined) {
	var views = lexterm.views || {};

	views.ServerView = Backbone.View.extend({
	});
	
	views.LexView = Backbone.View.extend({
	});
	
	views.LanguageView = Backbone.View.extend({
		template: Handlebars.compile($('#template-language').html()),
		
		events: {
			'click .submit': 'update',
			'change input': 'change'
		},
		
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.model.fetch(); // make sure we have all the data
		},
		
		render: function() {
		   var context = {};
		   context.name = this.model.get('name');
		   context.code = this.model.get('langCode');
		   context.lexemes = [];
		   var lexemes = this.model.lexemes.models;
		   for (var ind in lexemes) {
		   		context.lexemes.push({id: lexemes[ind].get('id'), // TODO: replace with correct lexId or id
		   		                      lang: context.code,
		   		                      lemma: lexemes[ind].get('lemma')});
		   }
		   
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
	
	views.ListView = Backbone.View.extend({
		tagName : "ul",
		
		events: {
			'click .item': 'showItem' 
		},
		
		initialize: function(opts) {
		    this.template = opts.template || this.template;
		    this.item_view = opts.item_view || this.item_view;
		    this.getContext = opts.getContext || this.getContext;
		    this.listenTo(this.collection, 'change', this.render);
		},
		
		render : function() {
			this.$el.html('');
			var that = this;
			this.collection.fetch().done(function(){
    			that.collection.each(function(item) {
                    var context = that.getContext(item);
    				that.$el.append(that.template(context))
    			});
			});
			return this;
		},
		
		showItem: function(evt) {
			var item = this.collection.get($(evt.target).data('id'));
			var item_view = new this.item_view({model: item});
			var display = $('#display');
			display.html('');
			item_view.setElement(display);
			item_view.render();
		},
		
		getContext: function(item) {
		    // override this method
		    return {};
		}
	});

	lexterm.views = views;
})(window.lexterm = window.lexterm || {}); 