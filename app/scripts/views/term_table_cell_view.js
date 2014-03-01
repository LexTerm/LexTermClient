Ltm.TermTableCellView = Ember.Table.TableCell.extend({
  templateName: 'term_table_cell',

  _repstring: "Loading...", //TODO localize this

  _lexeme: 0,

  repstring: function() {
    if (this.get('_repstring') == "Loading...") { // TODO: make this no longer dependent on the string
        this.load_repstring();
    }
    return this.get('_repstring');
  }.property('_repstring'),

  lexeme: function() {
    if (!this.get('_lexeme')) {
        this.load_lexeme();
    }
    return this.get('_lexeme');
  }.property('_lexeme'),

  store: function() {
    var content = this.get('cellContent');
    if (content) {
      return this.get('cellContent').get('store');
    }
  }.property('cellContent'),

  concept: function() {
    var content = this.get('cellContent');
    if (content) {
      return this.get('cellContent').get('concept');
    }
  }.property('cellContent', 'cellContent.concept'),

  language: function() {
    var content = this.get('cellContent');
    if (content) {
      return this.get('cellContent').get('language');
    }
  }.property('cellContent', 'cellContent.language'),

  load_lexeme: function() {
    var content = this.get('cellContent');
    var self = this;
    if (content) {
      self.get('store').find('lexeme', {
        concept: self.get('concept').get('id'),
        lexical_class__language: self.get('language').get('id')
      }).then(function(lexemes) {
        self.set('_lexeme', lexemes.objectAt(0)); // there should be only one
      });
    }
  }.observes('cellContent', 'concept', 'language'),

  load_repstring: function() {
    var content = this.get('cellContent');
    var self = this;
    if (content) {
      self.get('store').find('representation', {
        lexical_form__lexeme__concept: self.get('concept').get('id'),
        lexical_form__lexeme__lexical_class__language: self.get('language').get('id')
      }).then(function(reps) {
        var repstring = '';
        reps.forEach(function(rep) {
          repstring += rep.get('name') + '\n';
        });
        self.set('_repstring', repstring);
      });
    }
  }.observes('cellContent', 'concept', 'language')
});
