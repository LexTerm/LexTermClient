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
					this.lex_root.fetch();
     
          this.term_root = new models.TermRoot(linkifySelf(this.get('_links').term));
          this.term_root.fetch();
				});
			}

		});
		
    models.LexRoot = models.Base.extend({
      initialize: function () {
        this.on('sync', function () {
          this.languages = new Backbone.Collection([], {model: models.Language, url: linkifySelf(this.get('_links').languages)});
          this.languages.fetch();
				});
      }
    });
        
    models.TermRoot = models.Base.extend({
      
      initialize: function(attrs, opts) {
         this.on('sync', function () {
  					this.tbx = new models.TBX(linkifySelf(this.get('_links').tbx));
  					this.tbx.fetch();
       
            this.concepts = new Backbone.Collection([], {model: models.Concept, url: linkifySelf(this.get('_links').concepts)});
            this.concepts.fetch();
            
            this.subjects = new Backbone.Collection([], {model: models.Subject, url: linkifySelf(this.get('_links').subjects)});
            this.subjects.fetch();
  				});
        
       }
    }); 
        
    models.Language = models.Base.extend({
			initialize: function(attrs, opts) {
         this.on('sync', function () {}
            this.lexemes = new Backbone.Collection([], {model: models.Lexeme, url: linkifySelf(this.get('_links').lexemes)});
            this.lexemes.fetch();
            
            this.classes = new Backbone.Collection([], {model: models.LexicalClass, url: linkifySelf(this.get('_links').classes)});
            this.classes.fetch();
            
            this.enums = new Backbone.Collection([], {model: models.Enumeration, url: linkifySelf(this.get('_links').enums)});
            this.enums.fetch();
  				});
        
       }
		});
		
    models.Lexeme = models.Base.extend({
			
		});
		
    models.LexicalClass = models.Base.extend({

		});
		
	  models.Enumeration = models.Base.extend({

		});
		
    models.Concept = models.Base.extend({

		});
  
    models.Subject = models.Base.extend({

		});
  
    models.TBX = models.Base.extend({
      
    });
})(window.lexterm = window.lexterm || {});