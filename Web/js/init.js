$(function(){ 
var db, tocRactive, lexRactive, termRactive;

lexRactive = new Ractive({
	el: '#body',
	append: true,
	template: '#lextemp',
	data: {
		active: false
	}
});

lexRactive.observe('lexeme.pos',function(newValue){
	"use strict";
	db.Language(tocRactive.get('toc_lang')).classes.get(newValue).then(function(lexicalClass){
		lexRactive.set({
			lexicalClass: lexicalClass
		});
	});
});

termRactive = new Ractive({
	el: '#body',
	append: true,
	template: '#termtemp',
	data: {
		active: false
	}
});

tocRactive = new Ractive({
	el: '#toc',
	template: '#toctemp'
});

tocRactive.observe('toc_lang',function(newValue){
	"use strict";
	var newLang = db.Language(newValue);
	$.when(
		newLang.listLexemes(),
		newLang.representations.list(),
		newLang.classes.list()
	).then(function(lexemes, reps, classes){
		tocRactive.set({
			lang_reps: reps,
			lexemes: lexemes
		});
		lexRactive.set({
			active: false,
			representations: reps,
			classnames: classes
		});
	});
});

tocRactive.on('select',function(event,index){
	"use strict";
	var lexeme = tocRactive.data.lexemes[index];
	db.Language(tocRactive.get('toc_lang')).classes.get(lexeme.pos).then(function(lexicalClass){
		termRactive.set('active', false);
		lexRactive.set({
			active: true,
			index: index,
			lexeme: lexeme,
			lexicalClass: lexicalClass
		});
	});
});

tocRactive.on('addentry',function(){
	"use strict";
	termRactive.set('active', false);
	db.Language(tocRactive.get('toc_lang')).classes.get(lexRactive.get('classnames')[0]).then(function(lexicalClass){
		lexRactive.set({
			active: true,
			index: -1,
			lexeme: {},
			lexicalClass: lexicalClass
		});
	});
});

document.getElementById('connectbtn').addEventListener('click',function(){
	"use strict";
	var url = prompt("Enter Server URL:","http://lexterm.gevterm.net/api");
	if(!url){ return; }
	db = new LexTermServer(url);
	db.load().then(function(){
		return $.when(db.listLanguages(), db.listSubjects());
	}).then(function(langs, subjects){
		tocRactive.set({
			languages: langs,
			toc_lang: langs[0],
			subjects: subjects
		});
	});
},false);
});