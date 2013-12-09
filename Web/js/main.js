Handlebars.registerPartial("lexeme", $("#partial-lexeme").html());
Handlebars.registerPartial("language", $("#partial-language").html());

//var Router = Backbone.Router.extend({
//	routes: {
//		"lang": "listLanguages",
//		"lang/:code": "showLanguage",
//		"lang/:code/lexeme": 'listLexemes',
//		"lang/:code/lexeme/:id": 'showLexeme'
//	},
//	
//	initialize: function(opts) {
//		this.server = opts.server;
//		this.server.fetch().done(function() {
//			opts.server.lex_root.fetch();
//			opts.server.term_root.fetch();
//		});
//	},
//	
//	listLanguages: function() {
//		 $('#list').html('');
//		 var lang_list = new lexterm.views.ListView({
//			 					collection: this.server.lex_root.languages,
//			 					template: Handlebars.compile($('#partial-language').html()),
//			 					item_view: lexterm.views.LanguageView
//			 				});
//		 $('#list').append(lang_list.render().el);
//	},
//	
//	showLanguage: function(lang) {
//		this.listLanguages();
//		$('#lang-'+lang).click();
//	},
//	
//	listLexemes: function(lang) {
//		 $('#list').html('');
//		 var language = server.lex_root.languages.get(lang);
//		 var lex_list = new lexterm.views.ListView({
//			 					collection: language.lexemes,
//			 					template: Handlebars.compile($('#partial-lexeme').html()),
//			 					item_view: lexterm.views.LexemeView
//			 				});
//		 $('#list').append(lex_list.render().el);
//	},
//	
//	showLexeme: function(lang, id) {
//		this.listLexemes(lang);
//		$("#lexeme-"+id).click();
//	}
//	
//});
var server;
$('#server-input').change(function(evt){
	server = new lexterm.models.Server(lexterm.helpers.linkifySelf($(this).val()));
	server.fetch().done(function() {
		server.term_root.fetch();
		server.lex_root.fetch().done(function() {
			$('#page-title').text("Languages"); //TODO: move all this into a server view
            $('#list').html('');
        	var lang_list = new lexterm.views.ListView({
        		 					collection: server.lex_root.languages,
        		 					template: Handlebars.compile($('#partial-language').html()),
        		 					item_view: lexterm.views.LanguageView,
        		 					getContext: function(item) {
        								return {code: item.get('langCode'), name: item.get('name')};
        							}
        		 				});
        	$('#list').append(lang_list.render().el);
		});
	});
});








