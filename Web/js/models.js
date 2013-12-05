(function(lexterm, undefined){
	// local helpers 
	lexterm.helpers = lexterm.helpers || {};
	var linkifySelf = function(link) {
		return {'_links': {'self': link}};
	};
	
	lexterm.helpers.linkifySelf = linkifySelf;
	
	// models
	lexterm.models = lexterm.models || {};
	var models = lexterm.models;
	    
	models.Base = Backbone.Model.extend({
	    	
	    	
	    	//default url
            url: function() {
	    		return this.get('_links').self;
	    	}
	    });
	    
	models.Servers = Backbone.Collection.extend({
		model: models.Server,
		localStorage: new Backbone.LocalStorage("lexterm")
	});
	
    models.Server = models.Base.extend({
			
			initialize: function (attrs, opts) {
				this.on('sync', function () {
					this.lex_root = new models.LexRoot(linkifySelf(this.get('_links').lex));
					this.lex_root.fetch()
				});
			}

		});
		
    models.LexRoot = models.Base.extend({
        	
        });
        
    models.TermRoot = models.Base.extend({
        	
        }); 
        
    models.Language = models.Base.extend({
			
		});
		
    models.Lexeme = models.Base.extend({
			
		});
		
    models.LexicalClass = models.Base.extend({

		});
		
	models.Enumeration = models.Base.extend({

		});
		
    models.Concept = models.Base.extend({

		});
    
})(window.lexterm = window.lexterm || {});