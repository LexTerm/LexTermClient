var LexTermServer = (function($){
	"use strict";
	var proto;
	
	function make_request(method,target,body){
		return $.ajax(target,{
			type: method,
			data: JSON.stringify(body),
			processData: false,
			contentType: "application/json",
			dataType: "json"
		});
	}
	
	function Enums(base, lang){
		var emap = {};
		this.base = base;
		this.lang = lang;
		this.emap = emap;
		make_request("GET",base+"/conf/"+lang+"/enum").then(function(result){
			result.enums.forEach(function(name){
				make_request("GET",base+"/conf/"+lang+"/enum/"+name).then(function(result){
					emap[name] = result[name];
				});
			});
		});
	}
	
	proto = Enums.prototype;
	
	proto.get = function(name){
		return this.emap[name].slice(0);
	};
	proto.list = function(){
		return Object.keys(this.emap);
	};
	proto.addValue = function(name,body){
		var that = this;
		return make_request("POST",this.base+"/conf/"+this.lang+"/enum/"+name+"/add",body)
			.then(function(result){
				that.emap[name] = result[name];
			});
	};
	proto.removeValue = function(name,body){
		var that = this;
		return make_request("POST",this.base+"/conf/"+this.lang+"/enum/"+name+"/delete",body)
			.then(function(result){
				if(!result[name]){
					delete that.emap[name];
				}else{
					that.emap[name] = result[name];
				}
			});
	};
	
	function Representations(base, lang){
		var that = this;
		this.base = base;
		this.lang = lang;
		this.list = [];
		make_request("GET",this.base+"/conf/"+lang+"/representations").then(function(result){
			[].push.apply(that.list,result.representations);
		});
	}
	
	proto = Representations.prototype;
	
	proto.list = function(){
		return this.list.slice(0);
	};
	proto.add = function(body){
		var that = this;
		return make_request("POST",this.base+"/conf/"+this.lang+"/representations/add",body).then(function(result){
			that.list = result.representations;
		});
	};
	proto.remove = function(body){		
		var that = this;
		return make_request("POST",this.base+"/conf/"+this.lang+"/representations/delete",body).then(function(result){
			that.list = result.representations;
		});
	};
	
	function ClassList(base, lang){
		var cmap = {};
		this.base = base;
		this.lang = lang;
		this.cmap = cmap;
		make_request("GET",base+"/conf/"+lang+"/classes").then(function(result){
			result.classes.forEach(function(name){
				make_request("GET",base+"/conf/"+lang+"/classes/"+name).then(function(result){
					cmap[name] = Object.freeze(result);
				});
			});
		});
	}
	
	proto = ClassList.prototype;
	
	proto.get = function(name){
		return this.cmap[name];
	};
	
	proto.list = function(){
		return Object.keys(this.cmap);
	};
	
	proto.edit = function(name,body){
		var that = this;
		return make_request("POST",this.base+"/conf/"+this.lang+"/classes/"+name,body)
			.then(function(result){
				that.cmap[name] = Object.freeze(result);
			});
	};
	
	function LexTermLang(base,lang){
		this.enums = new Enums(base,lang);
		this.representations = new Representations(base,lang);
		this.classes = new ClassList(base,lang);
	}

	proto = LexTermLang.prototype;
	
	proto.listLexemes = function(){
		return make_request("GET",this.base+"/lex/"+this.lang);
	};
	proto.getLexeme = function(id){
		return make_request("GET",this.base+"/lex/"+this.lang+"/"+id);
	};
	proto.getLexemeByLemma = function(lemma){
		return make_request("GET",this.base+"/lex/"+this.lang+"/?lemma="+lemma);
	};
	
	proto.createLexeme = function(body){
		return make_request("POST",this.base+"/lex/"+this.lang,body);
	};
	proto.editLexeme = function(id,body){
		return make_request("POST",this.base+"/lex/"+this.lang+"/"+id,body);
	};
	
	function LexTermServer(base){
		var lmap = {};
		this.base = base;
		this.lmap = lmap;
		make_request("GET",this.base+"/conf/langs").then(function(result){
			result.langs.forEach(function(lcode){
				lmap[lcode] = new LexTermLang(base, lcode);
			});
		});
	}
	
	proto = LexTermServer.prototype;

	proto.Language = function(lang){
		return this.lmap[lang] || null;
	};
	
	//one returns an array, the other returns a promise. This is a problem.
	proto.listLanguages = function(){
		return Object.keys(this.lmap);
	};
	proto.listSubjects = function(){
		return make_request("GET",this.base+"/conf/subjects");
	};
	
	proto.listConcepts = function(subjects,langs){
		var squery = subjects.length?"subject="+subjects.join(','):"",
			lquery = langs.length?"lang="+langs.join(','):"",
			query;
		if(!(squery || lquery)){ throw new Error("Must Provide Search Filters"); }
		if(squery && lquery){ query = squery+"&"+lquery; }
		else{ query = squery+lquery; }
		return make_request("GET",this.base+"/term/concept/?"+query);
	};
	proto.getConcept = function(id,langs){
		var query = (langs && langs.length)?"?lang="+langs.join(','):"";
		return make_request("GET",this.base+"/term/concept/"+id+query);
	};
	proto.getConcept = function(id,langs){
		var query = (langs && langs.length)?"?lang="+langs.join(','):"";
		return make_request("GET",this.base+"/term/concept/"+id+query);
	};
	proto.getConceptByTerm = function(lemma,subjects,langs){
		var squery = subjects.length?"subject="+subjects.join(','):"",
			lquery = langs.length?"lang="+langs.join(','):"",
			query;
		if(!(squery || lquery)){ query = ""; }
		else if(squery && lquery){ query = "?"+squery+"&"+lquery; }
		else{ query = "?"+squery+lquery; }
		return make_request("GET",this.base+"/term/search/"+lemma+query);
	};

	proto.createConcept = function(body){
		return make_request("POST",this.base+"/term/concept/",body);
	};
	proto.editConcept = function(id,body){
		return make_request("POST",this.base+"/term/concept/"+id,body);
	};

	return LexTermServer;
}(jQuery));