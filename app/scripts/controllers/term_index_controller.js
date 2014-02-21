Ltm.TermIndexController = Ember.Controller.extend({
  activeLanguages: [],

  activeSubjectFields: [],

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
      //TODO optimize this
      var model = this.get('model');
      var activeLanguages = this.get('activeLanguages');
      var activeSubjectFields = this.get('activeSubjectFields');
      var concepts = model.concepts;
      if (activeSubjectFields.length) {
          concepts = concepts.filter(function (concept, ind, self) {
              var subject_fields = concept.get('subjectFields');
              return subject_fields.any(function(item) {
                  return activeSubjectFields.contains(item);
              });
          });
      }
      return concepts.map(function(concept) {
          var row = Ember.Object.create({
              id: concept.get('conceptId'),
              definition: concept.get('definition')
          });
          activeLanguages.forEach(function(lang){
              row.set(lang.get('locale'), {inner: '', destination: 'entry'});
              model.representations.filter(function(item, index, self) {
                  var rep_lang = item.get('lexicalForm').get('lexeme').get('lexicalClass').get('language');
                  var rep_concept = item.get('lexicalForm').get('lexeme').get('concept');
                  return rep_concept == concept && rep_lang == lang;
              }).forEach(function(rep) {
                  var old = row.get(lang.get('locale'));
                  old.inner += "\n"+rep.get('name');
                  old.instance = rep.get('lexicalForm').get('lexeme');
                  row.set(lang.get('locale'), old);
              });
          });
          return row;
      });
    }.property('model.concepts.@each', 'activeLanguages.@each', 'activeSubjectFields.@each')

});
