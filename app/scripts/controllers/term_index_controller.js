var ConceptArrayProxy = Ember.ArrayProxy.extend({

  objectAtContent: function(index) {
    var self = this;
    var content = this.get('content');
    var row = content.objectAt(index);
    if (row) {
      return row;
    } else {
      //row = Ember.Object.create({
        //id: 'Loading...', // TODO use loading gif
        //definition: 'Loading...',
        //isLoaded: false
      //});

      //Ember.RSVP.hash({
        //concepts: this.get('concepts'),
        //languages: this.get('languages'),
        //representations: this.get('representations')
        ////lexicalForms: this.get('lexicalForms'),
        ////lexicalClasses: this.get('lexicalClasses'),
        ////lexemes: this.get('lexemes')
      //}).then(function(data) {
        //var new_content = data.concepts.slice(self.get('start'), self.get('stop')).map(function(concept) {
          //return Ember.Object.create({
            //id: concept.get('id'),
            //definition: concept.get('definition'),
            //isLoaded: true
          //});
        //});

        //self.set('content', new_content);

        var rows = self.get('concepts').slice(self.get('start'), self.get('stop')).map(function(concept) {
          return Ember.Object.create({
            id: concept.get('id'),
            definition: concept.get('definition')
          });
        });


        var promise = Ember.RSVP.Promise.resolve(1);
        rows.forEach(function(row) {
          self.get('languages').forEach(function(lang) {
            row.set(lang.get('locale'), {inner: 'Loading...', destination: 'entry'});
            promise.then(function() {
              self.get('store').find('representation', {
                lexical_form__lexeme__concept: concept.get('id'),
                lexical_form__lexeme__lexical_class__language: lang.get('id')
              }).then(function(reps) {
                reps.forEach(function(rep) {
                var old = row.get(lang.get('locale'));
                if (old.inner === 'Loading...') {
                  old.inner = rep.get('name');
                } else {
                  old.inner += "\n"+rep.get('name');
                }
                old.instance = rep.get('lexicalForm').get('lexeme');
                row.set(lang.get('locale'), old);
                });
              });
            });
          });
        });
        //data.concepts.forEach(function(concept) {
          //console.log(concept.get('lexemes').get('lexicalForms'));
        //});
        //data.concepts.slice(index, index+20).forEach(function(concept, cind) {
          //row.set('id', concept.get('conceptId'));
          //row.set('definition', concept.get('definition'));
          //data.languages.forEach(function(lang) {
            //row.set(lang.get('locale'), {inner: 'Loading...', destination: 'entry'});
            //data.representations.forEach(function(rep) {
                //if (rep.get('lexicalForm').get('lexeme').get('lexicalClass').get('language') != lang) {
                  //return;
                //}
                //var old = row.get(lang.get('locale'));
                //if (old.inner === 'Loading...') {
                  //old.inner = rep.get('name');
                //} else {
                  //old.inner += "\n"+rep.get('name');
                //}
                //old.instance = rep.get('lexicalForm').get('lexeme');
                //row.set(lang.get('locale'), old);
              //});
            //});
          //row.set('isLoaded', true);
        //});
      //});
      self.set('content', rows);
      return rows[index]; //index may be incorrect
    }
  }
});

Ltm.TermIndexController = Ember.Controller.extend({

  numRows: 20,

  activeLanguages: [],

  languages: function() {
    return this.get('store').find('language', {
        lexical_classes__lexemes__collections: this.get('model').get('id')
      });
  }.property('model'),

  activeSubjectFields: [],

  subjectFields: function() {
    return this.get('store').find('subjectfield', {
        concepts__lexemes__collections: this.get('model').get('id')
      });
  }.property('model'),

  concepts: function() {
    return this.get('store').find('concept', {
        lexemes__collections: this.get('model').get('id')
      });
  }.property('model'),

  representations: function() {
    return this.get('store').find('representation', {
        lexical_form__lexeme__collections: this.get('model').get('id')
      });
  }.property('model'),

  lexemes: function() {
    return this.get('store').find('lexeme', {
        collections: this.get('model').get('id')
      });
  }.property('model'),

  lexicalForms: function() {
    return this.get('store').find('lexicalform', {
        lexeme__collections: this.get('model').get('id')
      });
  }.property('model'),

  lexicalClasses: function() {
    return this.get('store').find('lexicalclass', {
        lexemes__collections: this.get('model').get('id')
      });
  }.property('model'),

  columns: function () {
      var activeLanguages = this.get('activeLanguages');
      var idcol = Ember.Table.ColumnDefinition.create({
          headerCellName: "Concepts",
          contentPath: "representationMap"
      });
      var defcol = Ember.Table.ColumnDefinition.create({
          headerCellName: "Definition",
          contentPath: "definition"
      });

      cols = [idcol];

      activeLanguages.forEach(function(lang) {
        cols.push(Ember.Table.ColumnDefinition.create({
            headerCellName: lang.get('name'),
            tableCellViewClass: 'Ltm.LinkTableCellView',
            contentPath: lang.get('locale')
        }));
      });

      cols.push(defcol);
      return cols;

    }.property('activeLanguages.@each'),

    rows: function() {
      return ConceptArrayProxy.create({
        content: new Array(this.get('numRows')),
        start: 0,
        stop: this.get('numRows') + 0,
        concepts: this.get('concepts'),
        languages: this.get('activeLanguages'),
        //representations: this.get('representations'),
        //lexemes: this.get('lexemes'),
        //lexicalForms: this.get('lexicalForms'),
        store: this.get('store')
      });
      //return this.get('store').find('concept', {
          //lexemes__collections: this.get('model').get('id')
        //});
      //TODO optimize this
      //var model = this.get('model');
      //var activeLanguages = this.get('activeLanguages');
      //var activeSubjectFields = this.get('activeSubjectFields');
      //var concepts = model.concepts;
      //if (activeSubjectFields.length) {
          //concepts = concepts.filter(function (concept, ind, self) {
              //var subject_fields = concept.get('subjectFields');
              //return subject_fields.any(function(item) {
                  //return activeSubjectFields.contains(item);
              //});
          //});
      //}
      //return concepts.map(function(concept) {
          //var row = Ember.Object.create({
              //id: concept.get('conceptId'),
              //definition: concept.get('definition')
          //});
          //activeLanguages.forEach(function(lang){
              //row.set(lang.get('locale'), {inner: '', destination: 'entry'});
              //model.representations.filter(function(item, index, self) {
                  //var rep_lang = item.get('lexicalForm').get('lexeme').get('lexicalClass').get('language');
                  //var rep_concept = item.get('lexicalForm').get('lexeme').get('concept');
                  //return rep_concept == concept && rep_lang == lang;
              //}).forEach(function(rep) {
                  //var old = row.get(lang.get('locale'));
                  //old.inner += "\n"+rep.get('name');
                  //old.instance = rep.get('lexicalForm').get('lexeme');
                  //row.set(lang.get('locale'), old);
              //});
          //});
          //return row;
      //});
    }.property('model', 'numRows', 'concepts.@each', 'activeLanguages.@each', 'activeSubjectFields.@each')

});
