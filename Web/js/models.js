(function(lexterm, undefined) {
	// local helpers 
	lexterm.helpers = lexterm.helpers || {};
	var linkifySelf = function(link) {
		return {
			'_links' : {
				'self' : link
			}
		};
	};

	lexterm.helpers.linkifySelf = linkifySelf;

	// models
	lexterm.models = lexterm.models || {};
	var models = lexterm.models;

	models.Base = Backbone.Model.extend({
		//default idAttribute
		idAttribute: "name",
		//default url
		url : function() {
			return this.get('_links').self;
		}
	});

	models.BaseCollection = Backbone.Collection.extend({
		initialize: function(models, options) {
			if (options.url) {
				this.url = options.url;
			}
		}
	});
	
	models.Servers = Backbone.Collection.extend({
		model : models.Server,
		localStorage : new Backbone.LocalStorage("lexterm")
	});

	models.Server = models.Base.extend({

		initialize : function(attrs, opts) {
			this.on('sync', function() {
				this.lex_root = new models.LexRoot(linkifySelf(this
						.get('_links').lex));
				this.lex_root.fetch();

				this.term_root = new models.TermRoot(linkifySelf(this
						.get('_links').term));
				this.term_root.fetch();
			});
		}
	});

	models.LexRoot = models.Base.extend({
		initialize : function() {
			this.on('sync', function() {
				this.languages = new models.BaseCollection([], {
					model : models.Language,
					url : this.get('_links').languages
				});
				this.languages.fetch();
			});
		}
	});

	models.TermRoot = models.Base.extend({

		initialize : function(attrs, opts) {
			this.on('sync', function() {
				this.tbx = new models.TBX(linkifySelf(this.get('_links').tbx));
				this.tbx.fetch();

				this.concepts = new models.BaseCollection([], {
					model : models.Concept,
					url : this.get('_links').concepts
				});
				this.concepts.fetch();

				this.subjects = new models.BaseCollection([], {
					model : models.Subject,
					url : this.get('_links').subjects
				});
				this.subjects.fetch();
			});

		}
	});

	models.Language = models.Base.extend({
		
		idAttribute: "langCode",
		
		initialize : function(attrs, opts) {
			this.on('add', function() {this.trigger('sync')});
			this.on('sync', function() {

				this.lexemes = new models.BaseCollection([], {
					model : models.Lexeme,
					url : this.get('_links').lexemes
				});
				this.lexemes.fetch();
				
//				this.classes = new models.BaseCollection([], {
//					model : models.LexicalClass,
//					url : this.get('_links').classes
//				});
//				this.classes.fetch();

//				this.enums = new models.BaseCollection([], {
//					model : models.Enumeration,
//					url : this.get('_links').enums
//				});
//				this.enums.fetch();

//				this.reps = new models.BaseCollection([], {
//					model : models.Representation,
//					url : this.get('_links').reps
//				});
//				this.reps.fetch();
			});
		}
	});

	models.Lexeme = models.Base.extend({
		idAttribute: "lexId",
		initialize : function(attrs, opts) {
			this.on('sync', function() {
				this.lexical_class = new models.LexcalClass(linkifySelf(this
						.get('_links')['class']));
				this.lexical_class.fetch();

				this.forms = new models.BaseCollection([], {
					model : models.LexicalForm,
					url : this.get('_links').forms
				});
				this.forms.fetch();

				this.senses = new models.BaseCollection([], {
					model : models.Concept,
					url : this.get('_links').senses
				});
				this.senses.fetch();
			});

		}
	});

	models.LexicalClass = models.Base.extend({
		initialize : function(attrs, opts) {
			this.on('sync', function() {
				this.forms = new models.BaseCollection([], {
					model : models.LexicalForm,
					url : this.get('_links').forms
				});
				this.forms.fetch();
			});
		}
	});

	models.LexicalForm = models.Base.extend({

	});

	models.Enumeration = models.Base.extend({
		initialize : function(attrs, opts) {
			this.on('sync', function() {
				this.values = new models.BaseCollection([], {
					model : models.EnumerationValue,
					url : this.get('_links').values
				});
				this.values.fetch();
			});

		}
	});

	models.EnumerationValue = models.Base.extend({

	});

	models.Representation = models.Base.extend({

	});

	models.Subject = models.Base.extend({

	});

	models.Concept = models.Base.extend({
		idAttribute: "conceptId",
		
		initialize : function(attrs, opts) {
			this.on('sync', function() {
				this.terms = new models.BaseCollection([], {
					model : models.Lexeme,
					url : this.get('_links').terms
				});
				this.terms.fetch();
			});
		}
	});

	models.TBX = models.Base.extend({
		initialize : function(attrs, opts) {
			this.on('sync', function() {
				//this.upload = new models.Base(linkifySelf(this.get('_links')['import']));
				//this.upload.fetch();
				
				//this.download = new models.Base(linkifySelf(this.get('_links')['export']));
				//this.download.fetch();
				
				//this.validate = new models.Base(linkifySelf(this.get('_links')['validate']));
				//this.validate.fetch();
			});
		}
	});

})(window.lexterm = window.lexterm || {});