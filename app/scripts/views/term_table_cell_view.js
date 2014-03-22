Ltm.TermTableCellView = Ember.Table.TableCell.extend({
  templateName: 'term_table_cell',


  repstring: function() {
    var content = this.get('cellContent');
    if (content && content._source) {
      var lemma = content._source.lexical_forms.find(function(form) {
        return form.is_lemma;
      }).representations.find(function(rep) {
        return rep.representation_type.name == "written"; // WARN: magic word
      });
      return lemma.name;
    }
  }.property('cellContent'),

  lexeme: function() {
    var content = this.get('cellContent');
    if (content) {
      return Ember.Object.create(content._source);
    }
  }.property('cellContent'),

});
