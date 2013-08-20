var LexTermServer = (function($){
	"use strict";
	
	function make_request(method,target,body){
		var def = $.Deferred();
		$.ajax(target,{
			type: method,
			data: JSON.stringify(body),
			processData: false,
			contentType: "application/json",
			dataType: "json"
		}).then(function(response){
			if(false){ def.reject(problem); }
			else{ def.resolve(Object.freeze(response)); }
		});
		return def.promise();
	}
	
	function Enums(base, langCode){
		var emap = {};
		this.base = base;
		this.langCode = langCode;
		this.emap = emap;
		make_request("GET",base+"/lex/"+langCode+"/enums/").then(function(enums){
			enums.forEach(function(name){
				make_request("GET",base+"/lex/"+langCode+"/enums/"+name+"/").then(function(values){
					emap[name] = values;
				});
			});
		});
	}
	
	Enums.prototype.get = function(name){
		var def = $.Deferred();
		if(name in this.emap){ def.resolve(this.emap[name]); }
		else{ def.reject(); }
		return def.promise();
	};
	Enums.prototype.list = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.emap));
		return def.promise();
	};
	Enums.prototype.addValue = function(name,body){
		var emap = this.emap,
			promise = make_request("POST",this.base+"/lex/"+this.langCode+"/enums/"+name+"/add/",body);
		promise.then(function(values){ emap[name] = values; });
		return promise;
	};
	Enums.prototype.removeValue = function(name,body){
		var emap = this.emap,
			promise = make_request("POST",this.base+"/lex/"+this.langCode+"/enums/"+name+"/delete/",body);
		promise.then(function(values){
			if(!values.length){ delete emap[name]; }
			else{ emap[name] = values; }
		});
		return promise;
	};
	
	function Representations(base, langCode){
		var that = this;
		this.base = base;
		this.langCode = langCode;
		this.listDef = make_request("GET",this.base+"/lex/"+langCode+"/representations/");
	}
	
	Representations.prototype.list = function(){
		return this.listDef;
	};
	Representations.prototype.add = function(body){
		this.listDef = make_request("POST",this.base+"/lex/"+this.langCode+"/representations/add/",body);
		return this.listDef;
	};
	Representations.prototype.remove = function(body){
		this.listDef = make_request("POST",this.base+"/lex/"+this.langCode+"/representations/delete/",body);
		return this.listDef;
	};
	
	function ClassList(base, langCode){
		var cmap = {};
		this.base = base;
		this.langCode = langCode;
		this.cmap = cmap;
		make_request("GET",base+"/lex/"+langCode+"/classes").then(function(classes){
			classes.forEach(function(name){
				make_request("GET",base+"/lex/"+langCode+"/classes/"+name+"/")
					.then(function(classobj){ cmap[name] = classobj; });
			});
		});
	}
	
	ClassList.prototype.get = function(name){
		var def = $.Deferred();
		if(name in this.cmap){ def.resolve(this.cmap[name]); }
		else{ def.reject(); }
		return def.promise();
	};
	
	ClassList.prototype.list = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.cmap));
		return def.promise();
	};
	
	ClassList.prototype.edit = function(name,body){
		var cmap = this.cmap,
			promise = make_request("POST",this.base+"/lex/"+this.langCode+"/classes/"+name+"/",body);
		promise.then(function(classobj){ cmap[name] = classobj; });
		return promise;
	};
	
	function LexTermLang(base,lang){
		this.base = base;
		this.langCode = lang.langCode;
		this.name = lang.name;
		this.enums = new Enums(base,lang.langCode);
		this.representations = new Representations(base,lang.langCode);
		this.classes = new ClassList(base,lang.langCode);
	}
	
	LexTermLang.prototype.listLexemes = function(){
		return make_request("GET",this.base+"/lex/"+this.langCode+"/lexemes/");
	};
	LexTermLang.prototype.getLexeme = function(id){
		return make_request("GET",this.base+"/lex/"+this.langCode+"/lexemes/"+id+"/");
	};
	LexTermLang.prototype.getLexemeByLemma = function(lemma){
		return make_request("GET",this.base+"/lex/"+this.langCode+"/lemmas/"+lemma+"/");
	};
	
	LexTermLang.prototype.createLexeme = function(body){
		return make_request("POST",this.base+"/lex/"+this.langCode+"/lexemes/",body);
	};
	LexTermLang.prototype.editLexeme = function(id,body){
		return make_request("POST",this.base+"/lex/"+this.langCode+"/lexemes/"+id+"/",body);
	};
	
	function LexTermSubj(base,subj){
		this.base = base;
		this.subj = subj;
	}
	
	LexTermSubj.prototype.listConcepts = function(lcodes){
		var query = (lcodes && lcodes.length)?"?lang="+lcodes.join(','):"";
		return make_request("GET",this.base+"/term/subjects/"+this.subj+"/concepts/"+query);
	};
	LexTermSubj.prototype.getConcept = function(id,lcodes){
		var query = (lcodes && lcodes.length)?"?lang="+lcodes.join(','):"";
		return make_request("GET",this.base+"/term/subjects/"+this.subj+"/concepts/"+id+query);
	};
	LexTermSubj.prototype.getConceptByTerm = function(lemma,lcodes){
		var query = (lcodes && lcodes.length)?"?lang="+lcodes.join(','):"";
		return make_request("GET",this.base+"/term/subjects/"+this.subj+"/lemmas/"+lemma+query);
	};
	
	LexTermSubj.prototype.createConcept = function(body){
		return make_request("POST",this.base+"/term/subjects/"+this.subj+"/concepts/",body);
	};
	LexTermSubj.prototype.editConcept = function(id,body){
		return make_request("POST",this.base+"/term/subjects/"+this.subj+"/concepts/"+id+"/",body);
	};
	
	function LexTermServer(base){
		var lmap = {}, smap = {},
			d1 = $.Deferred(),
			d2 = $.Deferred();
		this.base = base;
		this.lmap = lmap;
		this.smap = smap;
		this.promise = $.when(d1.promise(), d2.promise());
		make_request("GET",this.base+"/lex/").then(function(langs){
			langs.forEach(function(lang){ lmap[lang.langCode] = new LexTermLang(base, lang); });
			d1.resolve();
		});
		make_request("GET",this.base+"/term/subjects/").then(function(subjs){
			subjs.forEach(function(sname){ smap[sname] = new LexTermSubj(base, sname); });
			d2.resolve();
		});
	}
	
	LexTermServer.prototype.load = function(){ return this.promise; };

	LexTermServer.prototype.Language = function(lang){ return this.lmap[lang]||null; };
	LexTermServer.prototype.Subject = function(subj){ return this.smap[subj]||null; };
	
	LexTermServer.prototype.listLanguages = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.lmap));
		return def.promise();
	};
	LexTermServer.prototype.listSubjects = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.smap));
		return def.promise();
	};

	LexTermServer.prototype.listConcepts = function(lcodes){
		var query = (lcodes && lcodes.length)?"?lang="+lcodes.join(','):"";
		return make_request("GET",this.base+"/term/concepts/"+query);
	};
	LexTermServer.prototype.getConcept = function(id,lcodes){
		var query = (lcodes && lcodes.length)?"/?lang="+langs.join(','):"/";
		return make_request("GET",this.base+"/term/concepts/"+id+query);
	};
	LexTermServer.prototype.getConceptByTerm = function(lemma,lcodes){
		var query = (lcodes && lcodes.length)?"/?lang="+langs.join(','):"/";
		return make_request("GET",this.base+"/term/lemmas/"+lemma+query);
	};
	
	LexTermServer.prototype.createConcept = function(body){
		return make_request("POST",this.base+"/term/concepts/",body);
	};
	LexTermServer.prototype.editConcept = function(id,body){
		return make_request("POST",this.base+"/term/concepts/"+id+"/",body);
	};

	return LexTermServer;
}(jQuery));