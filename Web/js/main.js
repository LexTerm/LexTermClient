
var servers = new lexterm.models.Servers();
var local_server = new lexterm.models.Server(lexterm.helpers.linkifySelf("http://localhost:8000/api")); 
var english;
local_server.once('server:ready', function(){
	servers.add(local_server)
	english = local_server.lex_root.languages.at(1);
	english.fetch().done(function(){
	console.log(english.lexemes);
	$('#sandbox').append(new lexterm.views.LanguageView({model: english}).render().el);
	});
});
local_server.fetch();




