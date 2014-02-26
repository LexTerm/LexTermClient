var ConceptArrayProxy = Ember.ArrayProxy.extend({

  objectAtContent: function(index) {
    var self = this;
    var content = this.get('content');
    var row = content.objectAt(index);
    if (row) {
      return row;
    } else {
      var rows = self.get('concepts').slice(self.get('start'), self.get('stop')).map(function(concept, cind) {
        var nrow = Ember.Object.create({
          id: concept.get('conceptId'),
          definition: concept.get('definition')
        });

        self.get('languages').forEach(function(lang) {
          nrow.set(lang.get('locale'), {inner: 'Loading...', destination: 'entry'});
          Ember.RSVP.hash({
            reps: self.get('store').find('representation', {
              lexical_form__lexeme__concept: concept.get('id'),
              lexical_form__lexeme__lexical_class__language: lang.get('id')
            }),
            lexeme: self.get('store').find('lexeme', {
              concept: concept.get('id'),
              lexical_class__language: lang.get('id')
            })
          }).then(function(hash) {
            var old_content = self.get('content');
            var old_row = old_content[cind];
            var old = old_row.get(lang.get('locale'));
            old.instance =  hash.lexeme.objectAt(0);
            hash.reps.forEach(function(rep) {
              if (old.inner === 'Loading...') {
                old.inner = rep.get('name');
              } else {
                old.inner += "\n"+rep.get('name');
              }
            });
            old_row.set(lang.get('locale'), old);
            old_content[cind] = old_row;
          });
        });
        return nrow;
      });
      self.set('content', rows);
    }
  }
});

Ltm.TermIndexController = Ember.Controller.extend({

  start: 0,
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

  columns: function () {
      var activeLanguages = this.get('activeLanguages');
      var idcol = Ember.Table.ColumnDefinition.create({
          headerCellName: "Concepts",
          contentPath: "id"
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
        start: this.get('start'),
        stop: this.get('numRows') + this.get('start'),
        concepts: this.get('model'),
        languages: this.get('activeLanguages'),
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
