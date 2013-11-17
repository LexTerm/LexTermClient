(function(lexterm, undefined){
	var models = {
		Server: Backbone.Model.extend({
			initialize: function () {
				if (this.collection.localStorage) {
					this.languages = new models.Languages({
						url: this.rootUrl + "/lex",
						localStorage: new Backbone.LocalStorage(this.urlRoot + "/lex")}
					);
					this.concepts = new models.Concepts({
						url: this.baseUrl + "/term/concepts",
						localStorage: new Backbone.LocalStorage(this.urlRoot + "/term/concepts")}
					);
				} else {
					this.languages = new models.Languages({url: this.urlRoot + "/lex"});
					this.concepts = new models.Concepts({url: this.urlRoot + "/term/concepts"});
				}
				
			}
		}),
		
		Servers: Backbone.Model.extend({
			model: models.Server
		}),
		
		Language: Backbone.Model.extend({
			initialize: function() {
				this.idAttribute = this.langCode;
				
				if (this.collection.localStorage) {
					this.lexemes = new models.Lexemes({
						url: this.url() + "/lexemes",
						localStorage: new Backbone.LocalStorage(this.url() + "/lexemes")}
					);
					this.lexical_classes = new models.LexicalClasses({
						url: this.url() + '/classes',
						localStorage: new Backbone.LocalStorage(this.url() + "/classes")}
					);
					this.enumerations = new models.Enumerations({
						url: this.url() + "/enums",
						localStorage: new Backbone.LocalStorage(this.url() + "/enums")}
					); 
				} else {
					this.lexemes = new models.Lexemes({url: this.url() + "/lexemes"});
					this.lexical_classes = new models.LexicalClasses({url: this.url() + '/classes'});
					this.enumerations = new models.Enumerations({url: this.url() + "/enums"}); 
				}

			}
			
		}),
		
		Languages: Backbone.Model.extend({
			model: models.Language
		}),
		
		Lexeme: Backbone.Model.extend({
			initialize: function() {
				this.idAttribute = this.lexId;
				if (this.collection.localStorage) {
					this.senses = new models.Concepts({
						url: this.url() + "/senses",
						localStorage: new Backbone.LocalStorage(this.url() + "/senses")}
					);
				} else {
					this.senses = new models.Concepts({url: this.url() + "/senses"});
				}
			}
		    defaults: function() {
		    	return {'senses': []}; // in case the server wants it in a POST
		    }
			
		}),
		
		Lexemes: Backbone.Model.extend({
			model: models.Lexeme
		}),
		
		LexicalClass: Backbone.Model.extend({
			initialize: function() {
				this.idAttribute = this.className;
			}
		}),
		
		LexicalClasses: Backbone.Model.extend({
			model: models.LexicalClass
		}),
		
		Enumeration: Backbone.Model.extend({
			initialize: function() {
				this.idAttribute = this.name;
			}
		}),
		
		Enumerations: Backbone.Model.extend({
			model: models.Enumeration
		}),
		
		Concept: Backbone.Model.extend({
			initialize: function() {
				this.idAttribute = this.conceptId;
				if (this.collection.localStorage) {
					this.languages = new models.Languages({
						url: this.url() + "/languages",
						localStorage: new Backbone.LocalStorage(this.url() + "/languages")}
					);
				} else {
					this.languages = new models.Languages({url: this.url() + "/languages"});
				}
			}
		}),
		
		Concepts: Backbone.Model.extend({
			model: models.Concept
		})
		
	}

	lexterm.models = models;
})(window.lexterm = window.lexterm || {});