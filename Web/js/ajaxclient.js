var LexTermServer = (function($){
	"use strict";
	var proto;
	
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
			else{ def.resolve(Object.freeze(response.result)); }
		});
		return def.promise();
	}
	
	function Enums(base, lang){
		var emap = {};
		this.base = base;
		this.lang = lang;
		this.emap = emap;
		make_request("GET",base+"/lex/"+lang+"/enums/").then(function(enums){
			enums.forEach(function(name){
				make_request("GET",base+"/lex/"+lang+"/enums/"+name+"/").then(function(values){
					emap[name] = values;
				});
			});
		});
	}
	
	proto = Enums.prototype;
	
	proto.get = function(name){
		var def = $.Deferred();
		if(name in this.emap){ def.resolve(this.emap[name]); }
		else{ def.reject(); }
		return def.promise();
	};
	proto.list = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.emap));
		return def.promise();
	};
	proto.addValue = function(name,body){
		var emap = this.emap,
			promise = make_request("POST",this.base+"/lex/"+this.lang+"/enums/"+name+"/add/",body);
		promise.then(function(values){ emap[name] = values; });
		return promise;
	};
	proto.removeValue = function(name,body){
		var emap = this.emap,
			promise = make_request("POST",this.base+"/lex/"+this.lang+"/enums/"+name+"/delete/",body);
		promise.then(function(values){
			if(!values.length){ delete emap[name]; }
			else{ emap[name] = values; }
		});
		return promise;
	};
	
	function Representations(base, lang){
		var that = this;
		this.base = base;
		this.lang = lang;
		this.list = null;
		make_request("GET",this.base+"/lex/"+lang+"/representations/")
			.then(function(reps){ that.list = reps; });
	}
	
	proto = Representations.prototype;
	
	proto.list = function(){
		var def = $.Deferred();
		def.resolve(this.list);
		return def.promise();
	};
	proto.add = function(body){
		var that = this,
			promise = make_request("POST",this.base+"/lex/"+this.lang+"/representations/add/",body);
		promise.then(function(reps){ that.list = reps; });
		return promise;
	};
	proto.remove = function(body){		
		var that = this,
			promise = make_request("POST",this.base+"/lex/"+this.lang+"/representations/delete/",body);
		promise.then(function(reps){ that.list = reps; });
		return promise;
	};
	
	function ClassList(base, lang){
		var cmap = {};
		this.base = base;
		this.lang = lang;
		this.cmap = cmap;
		make_request("GET",base+"/lex/"+lang+"/classes").then(function(classes){
			classes.forEach(function(name){
				make_request("GET",base+"/lex/"+lang+"/classes/"+name+"/")
					.then(function(classobj){ cmap[name] = classobj; });
			});
		});
	}
	
	proto = ClassList.prototype;
	
	proto.get = function(name){
		var def = $.Deferred();
		if(name in this.cmap){ def.resolve(this.cmap[name]); }
		else{ def.reject(); }
		return def.promise();
	};
	
	proto.list = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.cmap));
		return def.promise();
	};
	
	proto.edit = function(name,body){
		var cmap = this.cmap,
			promise = make_request("POST",this.base+"/lex/"+this.lang+"/classes/"+name+"/",body);
		promise.then(function(classobj){ cmap[name] = classobj; });
		return promise;
	};
	
	function LexTermLang(base,lang){
		this.base = base;
		this.lang = lang;
		this.enums = new Enums(base,lang);
		this.representations = new Representations(base,lang);
		this.classes = new ClassList(base,lang);
	}

	proto = LexTermLang.prototype;
	
	proto.listLexemes = function(){
		return make_request("GET",this.base+"/lex/"+this.lang+"/");
	};
	proto.getLexeme = function(id){
		return make_request("GET",this.base+"/lex/"+this.lang+"/lexemes/"+id+"/");
	};
	proto.getLexemeByLemma = function(lemma){
		return make_request("GET",this.base+"/lex/"+this.lang+"/lemma/"+lemma+"/");
	};
	
	proto.createLexeme = function(body){
		return make_request("POST",this.base+"/lex/"+this.lang+"/lexemes/",body);
	};
	proto.editLexeme = function(id,body){
		return make_request("POST",this.base+"/lex/"+this.lang+"/lexemes/"+id+"/",body);
	};
	
	function LexTermSubj(base,subj){
		this.base = base;
		this.subj = subj;
	}

	proto = LexTermSubj.prototype;
	
	proto.listConcepts = function(langs){
		var query = (langs && langs.length)?"?lang="+langs.join(','):"";
		return make_request("GET",this.base+"/term/"+this.subj+"/concepts/"+query);
	};
	proto.getConcept = function(id,langs){
		var query = (langs && langs.length)?"/?lang="+langs.join(','):"/";
		return make_request("GET",this.base+"/term/"+this.subj+"/concepts/"+id+query);
	};
	proto.getConceptByTerm = function(lemma,langs){
		var query = (langs && langs.length)?"/?lang="+langs.join(','):"/";
		return make_request("GET",this.base+"/term/"+this.subj+"/lemma/"+lemma+query);
	};
	
	proto.createConcept = function(body){
		return make_request("POST",this.base+"/term/"+this.subj+"/concepts/",body);
	};
	proto.editConcept = function(id,body){
		return make_request("POST",this.base+"/term/"+this.subj+"/concepts/"+id+"/",body);
	};
	
	function LexTermServer(base){
		var lmap = {}, smap = {};
		this.base = base;
		this.lmap = lmap;
		this.smap = smap;
		make_request("GET",this.base+"/lex/").then(function(langs){
			langs.forEach(function(lcode){ lmap[lcode] = new LexTermLang(base, lcode); });
		});
		make_request("GET",this.base+"/term/").then(function(subjs){
			subjs.forEach(function(sname){ smap[sname] = new LexTermSubj(base, sname); });
		});
	}
	
	proto = LexTermServer.prototype;

	proto.Language = function(lang){ return this.lmap[lang]||null; };
	proto.Subject = function(subj){ return this.smap[subj]||null; };
	
	proto.listLanguages = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.lmap));
		return def.promise();
	};
	proto.listSubjects = function(){
		var def = $.Deferred();
		def.resolve(Object.keys(this.smap));
		return def.promise();
	};

	proto.createConcept = function(body){
		return make_request("POST",this.base+"/concepts/",body);
	};
	proto.editConcept = function(id,body){
		return make_request("POST",this.base+"/concepts/"+id+"/",body);
	};

	return LexTermServer;
}(jQuery));