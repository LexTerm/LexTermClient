Ltm.TermIndexController = Ember.Controller.extend({

  start: 0,
  numRows: 5,

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
            tableCellViewClass: 'Ltm.TermTableCellView',
            contentPath: lang.get('locale')
        }));
      });

      cols.push(defcol);
      return cols;

    }.property('activeLanguages.@each'),

    rows: function() {
      var self = this;
      var end = this.get('numRows') + this.get('start');
      var concepts = this.get('model').filter(function(concept) {
        return self.get('activeSubjectFields').any(function(subjectfield) {
          var out = false;
          concept.get('subjectFields').forEach(function(field) {
            //TODO: determin if we are async here
            if (field == subjectfield) {
              out = true;
            }
          });
          return out;
        });
      });

      if (!concepts.length) {
       concepts = this.get('model');
      }

      return concepts.slice(this.get('start'), end).map(function(concept) {
        var row = Ember.Object.create({
          id: concept.get('conceptId'),
          definition: concept.get('definition')
        });

        self.get('activeLanguages').forEach(function(lang) {
          row.set(
            lang.get('locale'),
            Ember.Object.create({
              concept: concept,
              language: lang,
              store: self.get('store')
            })
          );
        });
        return row;
      });
    }.property('model', 'start', 'numRows', 'activeLanguages.@each', 'activeSubjectFields.@each')

});
