!function(){var a=window.Ltm=Ember.Application.create({LOG_ACTIVE_GENERATION:!0,LOG_MODULE_RESOLVER:!0,LOG_TRANSITIONS:!0,LOG_TRANSITIONS_INTERNAL:!0,LOG_VIEW_LOOKUPS:!0});a.SearchIndex=Ember.Object.extend({host:"localhost:9200",log:"trace",index:"ltm-entries",type:"entry",es:function(){return elasticsearch.Client({host:this.get("host"),log:this.get("log")})}.property("host","log"),search:function(a){return Ember.RSVP.Promise.cast(this.get("es").search({index:this.get("index"),type:this.get("type"),body:a}))}}),a.entries=a.SearchIndex.create()}(),function(){Ltm.CollectionController=Ember.ObjectController.extend({})}(),function(){Ltm.EntryController=Ember.ObjectController.extend({needs:"collection",proposedSubjectField:null,actions:{editLexId:function(a){var b=this.get("model");b.set("lexeId",a),b.get("collections").then(function(){b.save()})},editDefinition:function(a){var b=this.get("model.concept");b.set("definition",a),b.save()},removeSubjectField:function(a){var b=this.get("model.concept");b.get("subjectFields").removeObject(a),b.save()},updateFormListeners:function(){this.propertyWillChange("filteredForms"),this.propertyDidChange("filteredForms")}},collection:function(){return this.get("controllers.collection.model")}.property("model"),writtenType:function(){return this.get("store").find("representationtype",{name:"written"})}.property("model"),languages:function(){return this.get("store").find("language")}.property("model"),concepts:function(){return this.get("store").find("concept")}.property("model"),forms:function(){return this.get("store").find("form")}.property("model"),filteredForms:function(){var a=this.get("model.lexicalForms"),b=a.map(function(a){return a.get("form")}),c=Ember.ArrayProxy.create({}),d=this.get("forms");return d.then(function(a){var d=a.filter(function(a){return!b.contains(a)});c.set("content",d)}),c}.property("forms","model.lexicalForms.@each"),subjectFields:function(){return this.get("store").find("subjectfield")}.property("model"),filteredSubjectFields:function(){var a=this.get("model.concept.subjectFields"),b=this.get("subjectFields");return b.filter(function(b){return!a.contains(b)})}.property("subjectFields","model.concept.subjectFields.@each"),nextLanguage:function(a,b){var c=this,d=c.get("model");return b&&b.get("lexicalClasses").then(function(a){var e=a.findBy("name","*");e?(d.set("lexicalClass",e),d.save()):(e=c.get("store").createRecord("lexicalclass",{name:"*",language:b}),e.save().then(function(){d.set("lexicalClass",e),d.save()}))}),d.get("lexicalClass.language")}.property("model.lexicalClass.language"),nextConcept:function(a,b){var c=this.get("model");return b&&(c.set("concept",b),c.save()),c.get("concept")}.property("model.concept"),nextLexicalClass:function(a,b){var c=this.get("model");return b&&(c.set("lexicalClass",b),c.save()),c.get("lexicalClass")}.property("model.lexicalClass"),nextLexicalForm:function(a,b){var c=this;if(b){var d=c.get("model.lexicalForms"),e=d.length<1,f=c.get("store").createRecord("lexicalform",{isLemma:e,form:b,lexeme:c.get("model")});f.save().then(function(){c.get("writtenType").then(function(a){a=a.get("firstObject");var b=c.get("store").createRecord("representation",{representationType:a,lexicalForm:f});b.save().then(function(){window.location.reload()})})})}return null}.property("model.lexicalForms.@each","writtenType"),subjectFieldObserver:function(){this.get("proposedSubjectField")&&(this.get("model.concept.subjectFields").pushObject(this.get("proposedSubjectField")),this.set("proposedSubjectField",null))}.observes("proposedSubjectField")})}(),function(){Ltm.EntryFeaturesController=Ember.ObjectController.extend({actions:{save:function(){var a=this.get("feature"),b=this.get("value");a&&b&&(b.set("feature",a),a.save().then(function(){b.save().then(function(){window.location.reload()})}),this.transitionTo("entry"))}},features:function(){return this.get("store").find("feature")}.property("model"),values:function(){return this.get("store").find("featurevalue")}.property("model"),feature:function(a,b){var c=this.get("model.feature");if(b){try{c=this.get("store").createRecord("feature",b)}catch(d){c=b}this.get("model").set("feature",c)}return c}.property("model"),value:function(a,b){var c=this.get("model.feature_value");if(b){try{c=this.get("store").createRecord("featurevalue",b)}catch(d){c=b}this.get("model").set("feature_value",c)}return c}.property("model")})}(),function(){Ltm.EntryFormController=Ember.ObjectController.extend({allFeatures:function(){return this.get("store").find("featurevalue")}.property("model"),newFeatures:function(){var a=Ember.ArrayProxy.create({});return Ember.RSVP.hash({all_features:this.get("allFeatures"),model_features:this.get("model.features")}).then(function(b){var c=b.model_features.map(function(a){return a.get("feature")});new_features=b.all_features.filter(function(a){return!b.model_features.contains(a)&&!c.contains(a.get("feature"))}),a.set("content",new_features)}),a}.property("model","allFeatures.@each","model.features.@each")})}(),function(){Ltm.EntryLexicalclassController=Ember.ObjectController.extend({languages:function(){return this.get("store").find("language")}.property("model")})}(),function(){Ltm.IndexController=Ember.ArrayController.extend({uploadMessage:"Upload TBX",uploadUrl:function(){return"http://localhost:8000/api/tbx/import/"}.property(),changeUploadMessage:function(a){this.set("uploadMessage",a)},redirectToTerminology:function(){this.get("collection")?this.transitionToRoute("term"):this.transitionToRoute("term",1)}})}(),function(){Ltm.LexController=Ember.ArrayController.extend({needs:"collection",collection:function(){return this.get("controllers.collection.model")}.property()})}(),function(){Ltm.LexEntryController=Ember.Controller.extend({needs:"collection",start:0,numRows:5,pages:[],adjustLimit:function(a){this.set("numRows",a)},adjustStart:function(a){this.set("start",a)},collection:function(){return this.get("controllers.collection.model")}.property("model"),entries:function(){var a=this,b=Ember.ArrayProxy.create({content:[]});return Ltm.entries.search({from:this.get("start"),size:this.get("numRows"),sort:"lexical_forms.representations.name",query:{filtered:{query:{nested:{path:"collections",query:{match:{"collections.id":this.get("collection").get("id")}}}},filter:{term:{"lexical_class.language.locale":this.get("model").get("locale")}}}}}).then(function(c){for(var d=c.hits.total,e=d?Math.ceil(d/a.get("numRows")):0,f=a.get("start"),g=Array(e),h=0;e>h;h++){var i=h*a.get("numRows");g[h]=Ember.Object.create(i==f?{active:!0,value:i,index:h+1}:{active:!1,value:i,index:h+1})}!g.findBy("active")&&g.length&&g.get("lastObject").set("active",!0),a.set("pages",g),b.set("content",c.hits.hits.map(function(a){var b=Ember.Object.create(a._source);b.get("lexical_forms").forEach(function(a){a.written_representation=a.representations.find(function(a){return"written"==a.representation_type.name})});var c=b.get("lexical_forms").findBy("is_lemma").written_representation.name;return b.set("name",c),b}))}).catch(function(a){console.log(a)}),b}.property("collection","model","numRows","start")})}(),function(){Ltm.EntriesController=Ember.ObjectController.extend({needs:"collection",collection:function(){return this.get("controllers.collection.model")}.property(),concepts:function(){return this.get("store").find("concept")}.property("model"),languages:function(){return this.get("store").find("language")}.property("model"),forms:function(){return this.get("store").find("form")}.property("model"),writtenType:function(){return this.get("store").find("representationtype",{name:"written"})}.property("model"),saveRepresentation:function(a,b){var c=this,d=c.get("store").createRecord("lexicalform",{isLemma:!0,form:b,lexeme:a});d.save().then(function(){c.get("writtenType").then(function(a){if(a=a.get("firstObject")){var b=c.get("store").createRecord("representation",{representationType:a,lexicalForm:d,name:c.get("lemmaName")});b.save().then(function(){window.location.reload()})}else c.get("store").createRecord("representationtype",{name:"written"}).save(function(a){var b=c.get("store").createRecord("representation",{representationType:a,lexicalForm:d,name:c.get("lemmaName")});b.save().then(function(){window.location.reload()})})})})},saveLexForm:function(a){var b=this;b.get("forms").then(function(c){var d=c.findBy("name","*");d?b.saveRepresentation(a,d):(d=b.get("store").createRecord("form",{name:"*"}),d.save().then(function(c){b.saveRepresentation(a,c)}))})},actions:{save:function(){var a=this,b=a.get("model");b.get("collections").then(function(b){b.pushObject(a.get("collection"))});var c=a.get("language");c.get("lexicalClasses").then(function(d){var e=d.findBy("name","*");e?(b.set("lexicalClass",e),b.save().then(function(){a.saveLexForm(b),a.transitionToRoute("entry",b)})):(e=a.get("store").createRecord("lexicalclass",{name:"*",language:c}),e.save().then(function(){b.set("lexicalClass",e),b.save().then(function(){a.saveLexForm(b),a.transitionToRoute("entry",b)})}))})}}})}(),function(){Ltm.TbxController=Ember.Controller.extend({uploadMessage:"Upload TBX",collection:function(){return this.get("model")}.property("model"),uploadUrl:function(){return"http://localhost:8000/api/tbx/import/"}.property(),changeUploadMessage:function(a){this.set("uploadMessage",a)},redirectToTerminology:function(){Ember.run.later(this,function(){this.transitionToRoute("term")},1300)}})}(),function(){Ltm.TermIndexController=Ember.Controller.extend({needs:"collection",start:0,scrollSize:10,numRows:10,pages:[],adjustLimit:function(a){this.set("numRows",a)},adjustStart:function(a){this.set("start",a)},collection:function(){return this.get("controllers.collection.model")}.property(),activeLanguages:[],languages:function(){return this.get("store").find("language",{lexical_classes__lexemes__collections:this.get("model").get("id")})}.property("model"),activeSubjectFields:[],subjectFields:function(){return this.get("store").find("subjectfield",{concepts__lexemes__collections:this.get("model").get("id")})}.property("model"),columns:function(){var a=this.get("activeLanguages"),b=Ember.Table.ColumnDefinition.create({headerCellName:"Concepts",contentPath:"id"}),c=Ember.Table.ColumnDefinition.create({headerCellName:"Definition",contentPath:"definition"});return cols=[b],a.forEach(function(a){cols.push(Ember.Table.ColumnDefinition.create({headerCellName:a.get("name"),tableCellViewClass:"Ltm.TermTableCellView",contentPath:a.get("locale")}))}),cols.push(c),cols}.property("activeLanguages.@each"),rows:function(){var a={filtered:{query:{nested:{path:"collections",query:{match:{"collections.id":this.get("collection").get("id")}}}},filter:{and:[{terms:{"lexical_class.language.locale":this.get("activeLanguages").mapBy("locale")}}]}}};this.get("activeSubjectFields").length&&a.filtered.filter.and.push({nested:{path:"concept.subject_fields",filter:{terms:{"concept.subject_fields.id":this.get("activeSubjectFields").mapBy("id")}}}});var b=Ltm.entries.search({from:this.get("start"),size:this.get("numRows")*this.get("activeLanguages").toArray().length,sort:"concept.id",query:a}),c=this;return b.then(function(a){for(var b=a.hits.total,d=c.get("numRows"),e=c.get("activeLanguages").toArray().length,f=b?Math.ceil(b/(d*e)):0,g=c.get("start"),h=Array(f),i=0;f>i;i++){var j=i*d*e;h[i]=Ember.Object.create(j==g?{active:!0,value:j,index:i+1}:{active:!1,value:j,index:i+1})}!h.findBy("active")&&h.length&&h.get("lastObject").set("active",!0),c.set("pages",h)}),this.get("entriesProxy").create({content:[],languages:this.get("activeLanguages"),size:this.get("scrollSize"),entries:b})}.property("model","start","numRows","activeLanguages.@each","activeSubjectFields.@each"),entriesProxy:Ember.ArrayProxy.extend({objectAtContent:function(a){var b=this,c=b.get("content"),d=c[a];if(d)return d;for(var e=b.get("size"),f=[],g=function(a){i.set(a.get("locale"),{})},h=0;e>h;h++){var i=Ember.Object.create({definition:"",id:""});b.get("languages").forEach(g),f.push(i)}b.set("content",f),b.get("entries").then(function(a){var c,d=[];entries=a.hits.hits,entries.forEach(function(a){var e,f=a._source.concept.id;if(f==c)e=a._source.lexical_class.language.locale,d.get("lastObject").set(e,a);else{c=f;var g=Ember.Object.create({definition:a._source.concept.definition,id:a._source.concept.concept_id});e=a._source.lexical_class.language.locale,g.set(e,a),d.pushObject(g),b.set("content",d)}})})}})})}(),function(){Ltm.EditableSelectComponent=Ember.Widgets.SelectComponent.extend({templateName:"select",newClass:Ember.Object.extend(Ember.Copyable),queryPropertyName:"name",filteredContent:Ember.computed(function(){var a,b,c,d=this;if(a=this.get("content"),c=this.get("query"),!a)return[];if(b=this.get("content").filter(function(a){return d.matcher(c,a)}),0===b.length){var e={},f=this.get("queryPropertyName");e[f]=c,e.copy=function(){return e};var g=this.get("newClass").create(e);b=[g]}return this.get("sortLabels")?_.sortBy(b,function(a){var b;return null!==(b=a.get(d.get("optionLabelPath")))?b.toLowerCase():void 0}):b}).property("content.@each","query","optionLabelPath","sortLabels")})}(),function(){Ltm.LexicalFormComponent=Ember.Component.extend({tagName:"tr",isEditing:!1,nextForm:function(a,b){var c=this.get("lexForm");return b&&(c.set("form",b),c.save(),this.sendAction("updateFormListeners")),c.get("form")}.property("lexForm"),actions:{editWrittenRepresentation:function(a){var b=this,c=this.get("lexForm.writtenRepresentation");b.set("isEditing",!0),c.set("name",a),c.get("content").save().then(function(){b.set("isEditing",!1)})},makeLemma:function(){var a=this,b=this.get("lexForm");a.set("isEditing",!0),b.set("isLemma",!0),b.save().then(function(){a.set("isEditing",!1),window.location.reload()})}}})}(),function(){Ltm.PagerComponentComponent=Ember.Component.extend({sizes:[Ember.Object.create({active:!0,value:10}),Ember.Object.create({active:!1,value:25}),Ember.Object.create({active:!1,value:50})],firstDisabled:!0,leftDisabled:!0,rightDisabled:!0,lastDisabled:!0,pages:function(){var a=3,b=this.get("allPages");if(0===b.length)return[];var c=b.findBy("active"),d=c.get("index")-a;d>1-a?(this.set("firstDisabled",!1),this.set("leftDisabled",!1)):(this.set("firstDisabled",!0),this.set("leftDisabled",!0)),0>d&&(d=0);var e=c.get("index")+a-1;return e>=b.length+(a-1)?(this.set("lastDisabled",!0),this.set("rightDisabled",!0)):(this.set("lastDisabled",!1),this.set("rightDisabled",!1)),b.slice(d,e)}.property("allPages"),actions:{changeLimit:function(a){this.get("sizes").findBy("active").set("active",!1),this.get("sizes").findBy("value",a).set("active",!0),this.sendAction("setLimit",a)},changePage:function(a){this.get("pages").findBy("active").set("active",!1),this.get("pages").findBy("value",a).set("active",!0),this.sendAction("setStart",a)},goToFirst:function(){this.get("firstDisabled")||this.sendAction("setStart",0)},goToLast:function(){if(!this.get("lastDisabled")){var a=this.get("allPages").get("lastObject").get("value");this.sendAction("setStart",a)}},moveLeft:function(){if(!this.get("leftDisabled")){var a=this.get("pages").findBy("active"),b=this.get("pages").indexOf(a),c=this.get("pages")[b-1];this.sendAction("setStart",c.get("value"))}},moveRight:function(){if(!this.get("rightDisabled")){var a=this.get("pages").findBy("active"),b=this.get("pages").indexOf(a),c=this.get("pages")[b+1];this.sendAction("setStart",c.get("value"))}}}})}(),function(){Ltm.FileUploadComponent=Ember.FileField.extend({url:"",filesDidChange:function(){var a=this,b=this.get("url"),c=this.get("files"),d=Ember.Uploader.createWithMixins({url:b,upload:function(b){var c=a.get("collection"),d=c?c.get("name"):"",e=this.setupFormData(b,{collection:d}),f=this.get("url"),g=this.get("type"),h=this;return this.set("isUploading",!0),this.ajax(f,e,g).then(function(a){return h.didUpload(a),a})}});Ember.isEmpty(c)||(d.on("didUpload",function(){a.sendAction("redirect"),a.sendAction("displayStatus","Upload TBX")}),a.sendAction("displayStatus",""),d.upload(c[0]))}.observes("files")})}(),function(){Ltm.ApplicationAdapter=DS.DjangoRESTAdapter.extend({host:"http://localhost:8000",namespace:"api"})}(),function(){Ltm.Collection=DS.Model.extend({name:DS.attr("string"),lexemes:DS.hasMany("lexeme",{async:!0})}),Ltm.Collection.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Concept=DS.Model.extend({conceptId:DS.attr("string"),definition:DS.attr("string",{defaultValue:""}),subjectFields:DS.hasMany("subjectfield",{async:!0}),lexemes:DS.hasMany("lexeme",{async:!0})}),Ltm.Concept.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Feature=DS.Model.extend({name:DS.attr("string"),featurevalues:DS.hasMany("featurevalue",{async:!0})}),Ltm.Feature.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Featurevalue=DS.Model.extend({name:DS.attr("string"),feature:DS.belongsTo("feature"),forms:DS.hasMany("form",{async:!0})}),Ltm.Featurevalue.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Form=DS.Model.extend({name:DS.attr("string"),lexemes:DS.hasMany("lexeme",{async:!0}),lexicalForms:DS.hasMany("lexicalform",{async:!0}),features:DS.hasMany("featurevalue",{async:!0})}),Ltm.Form.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Language=DS.Model.extend({langCode:DS.attr("string"),regionCode:DS.attr("string",{defaultValue:""}),name:DS.attr("string"),lexicalClasses:DS.hasMany("lexicalclass",{async:!0}),locale:function(){return this.get("langCode")+"_"+this.get("regionCode")}.property("langCode","regionCode")}),Ltm.Language.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Lexeme=DS.Model.extend({lexId:DS.attr("string"),lexicalClass:DS.belongsTo("lexicalclass"),concept:DS.belongsTo("concept"),notes:DS.hasMany("note",{async:!0}),forms:DS.hasMany("form",{async:!0}),lexicalForms:DS.hasMany("lexicalform",{async:!0}),collections:DS.hasMany("collection",{async:!0}),lemma:function(){var a=this,b=Ember.ObjectProxy.create({});return this.get("store").find("representation",{lexical_form__lexeme:a.get("id"),lexical_form__is_lemma:!0,representation_type__name:"written"}).then(function(c){var d=c.get("firstObject");a.get("id")?b.set("content",d):b.set("content",{name:"* * * New Entry * * *"})}),b}.property("lexicalForms.@each")}),Ltm.Lexeme.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Lexicalclass=DS.Model.extend({name:DS.attr("string"),language:DS.belongsTo("language"),lexemes:DS.hasMany("lexeme",{async:!0})}),Ltm.Lexicalclass.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Lexicalform=DS.Model.extend({isLemma:DS.attr("boolean"),form:DS.belongsTo("form"),lexeme:DS.belongsTo("lexeme"),representations:DS.hasMany("representation",{async:!0}),writtenRepresentation:function(){var a=Ember.ObjectProxy.create();return this.get("store").find("representation",{lexical_form:this.get("id"),representation_type__name:"written"}).then(function(b){var c=b.get("firstObject");a.set("content",c)}),a}.property("representations.@each")}),Ltm.Lexicalform.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Note=DS.Model.extend({note:DS.attr("string"),noteType:DS.attr("string"),lexeme:DS.belongsTo("lexeme")}),Ltm.Note.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()}),Ltm.Note.FIXTURES=[{id:0,note:"foo",note_type:"foo"},{id:1,note:"foo",note_type:"foo"}]}(),function(){Ltm.Representation=DS.Model.extend({name:DS.attr("string",{defaultValue:"*"}),representationType:DS.belongsTo("representationtype"),lexicalForm:DS.belongsTo("lexicalform")}),Ltm.Representation.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()})}(),function(){Ltm.Representationtype=DS.Model.extend({name:DS.attr("string"),representations:DS.hasMany("representation",{async:!0})}),Ltm.Representationtype.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Em.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()}),Ltm.Representationtype.FIXTURES=[{id:0,name:"foo"},{id:1,name:"foo"}]}(),function(){Ltm.Subjectfield=DS.Model.extend({name:DS.attr("string"),concepts:DS.hasMany("concept",{async:!0})}),Ltm.Subjectfield.reopen({attributes:function(){var a=this;return Ember.keys(this.get("data")).map(function(b){return Ember.Object.create({model:a,key:b,valueBinding:"model."+b})})}.property()}),Ltm.Subjectfield.FIXTURES=[{id:0,name:"foo"},{id:1,name:"foo"}]}(),function(){Ltm.ApplicationRoute=Ember.Route.extend({model:function(){return this.store.find("collection",{name:"All"}).then(function(a){return a.get("firstObject")})},beforeModel:function(){var a=this;return a.get("store").find("collection",{name:"All"}).then(function(b){var c=b.get("firstObject");return c?c:a.get("store").createRecord("collection",{name:"All"}).save()})}})}(),function(){Ltm.EntriesConceptRoute=Ember.Route.extend({model:function(){return this.get("store").createRecord("concept",{})},renderTemplate:function(){this.render("entry/concept")},actions:{save:function(){var a=this,b=this.modelFor("entries.concept");b.save().then(function(){a.transitionTo("entries")})}}})}(),function(){Ltm.EntriesLanguageRoute=Ember.Route.extend({model:function(){return this.get("store").createRecord("language")},renderTemplate:function(){this.render("entry/language")},actions:{save:function(){var a=this,b=this.modelFor("entries.language");b.save().then(function(){a.transitionTo("entry")})}}})}(),function(){Ltm.EntriesRoute=Ember.Route.extend({model:function(){return this.store.createRecord("lexeme")}})}(),function(){Ltm.EntryConceptRoute=Ember.Route.extend({model:function(){return this.get("store").createRecord("concept",{})},actions:{save:function(){var a=this.modelFor("entry.concept");a.save().then(function(){window.location.reload()}),this.transitionTo("entry")}}})}(),function(){Ltm.EntryFeaturesRoute=Ember.Route.extend({model:function(){return Ember.Object.create({})}})}(),function(){Ltm.EntryFormRoute=Ember.Route.extend({model:function(){return this.get("store").createRecord("form",{})},actions:{save:function(){var a=this.modelFor("entry.form");a.save().then(function(){window.location.reload()}),this.transitionTo("entry")}}})}(),function(){Ltm.EntryLanguageRoute=Ember.Route.extend({model:function(){return this.get("store").createRecord("language",{})},actions:{save:function(){var a=this.modelFor("entry.language");a.save().then(function(){window.location.reload()}),this.transitionTo("entry")}}})}(),function(){Ltm.EntryLexicalclassRoute=Ember.Route.extend({model:function(){return this.get("store").createRecord("lexicalclass",{})},actions:{save:function(){var a=this.modelFor("entry.lexicalclass");a.save().then(function(){window.location.reload()}),this.transitionTo("entry")}}})}(),function(){Ltm.EntryRoute=Ember.Route.extend({actions:{deleteEntry:function(){this.controllerFor("entry.delete").set("loading",!0);var a=this.modelFor("entry");a.deleteRecord(),a.save(),Ember.run.later(this,function(){this.modelFor("collection");this.transitionTo("term").then(function(){window.location.reload()})},1e3)}}})}(),function(){Ltm.EntrySubjectfieldRoute=Ember.Route.extend({model:function(){return this.get("store").createRecord("subjectfield",{})},actions:{save:function(){var a=this.modelFor("entry.subjectfield");a.save().then(function(){window.location.reload()}),this.transitionTo("entry")}}})}(),function(){Ltm.IndexRoute=Ember.Route.extend({model:function(){return this.store.find("collection",{name:"All"})},beforeModel:function(){var a=this;return a.get("store").find("collection",{name:"All"}).then(function(b){var c=b.get("firstObject");return c?c:a.get("store").createRecord("collection",{name:"All"}).save()})}})}(),function(){Ltm.LexEntryRoute=Ember.Route.extend({})}(),function(){Ltm.LexRoute=Ember.Route.extend({model:function(){var a=this.modelFor("collection");return this.get("store").find("language",{lexical_classes__lexemes__collections:a.get("id")})}})}(),function(){Ltm.NewEntryRoute=Ember.Route.extend({beforeModel:function(){var a=this;return a.get("store").find("collection",{name:"All"}).then(function(b){var c=b.get("firstObject");return c?c:a.get("store").createRecord("collection",{name:"All"}).save()}).then(function(b){a.transitionTo("entries",b.get("id"))})}})}(),function(){Ltm.TbxRoute=Ember.Route.extend({model:function(){var a=this.modelFor("collection");return this.get("store").find("language",{lexical_classes__lexemes__collections:a.get("id")})}})}(),function(){Ltm.TermIndexRoute=Ember.Route.extend({model:function(){return this.modelFor("collection")}})}(),function(){Ltm.TermRoute=Ember.Route.extend({})}(),function(){Ltm.TermTableCellView=Ember.Table.TableCell.extend({templateName:"term_table_cell",repstring:function(){var a=this.get("cellContent");if(a&&a._source){var b=a._source.lexical_forms.find(function(a){return a.is_lemma}).representations.find(function(a){return"written"==a.representation_type.name});return b.name}}.property("cellContent"),lexeme:function(){var a=this.get("cellContent");return a?Ember.Object.create(a._source):void 0}.property("cellContent")})}(),function(){Ltm.Router.map(function(){this.resource("collections",function(){}),this.resource("collection",{path:"collection/:collection_id"},function(){this.resource("term",function(){}),this.resource("lex",function(){this.route("entry",{path:"language/:language_id/entries"})}),this.resource("entry",{path:"entry/:lexeme_id"},function(){this.route("delete"),this.route("language"),this.route("lexicalclass"),this.route("concept"),this.route("subjectfield"),this.route("form"),this.route("features")}),this.resource("entries",{},function(){this.route("language"),this.route("concept")}),this.resource("tbx",function(){})}),this.route("new-entry")})}();