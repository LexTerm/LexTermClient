Ltm.TermTableCellView = Ember.Table.TableCell.extend({
  templateName: 'term_table_cell',

  _repstring: null,

  _lexeme: null,

  repstring: function() {
    if (!this.get('_repstring')) {
        this.load_repstring();
        return "Loading..."; //TODO Localize this
    } else {
      return this.get('_repstring');
    }
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

  entries: function() {
    var content = this.get('cellContent');
    if (content) {
      return this.get('cellContent').get('entries');
    }
  }.property('cellContent', 'cellContent.language'),

  load_lexeme: function() {
    var content = this.get('cellContent');
    var self = this;
    if (content) {
      var concept_id = parseInt(self.get('concept').get('id'));
      var lang_id = parseInt(self.get('language').get('id'));
      self.get('entries').then(function(data) {
        var entry = data.hits.hits.find(function(item) {
          return item._source.concept.id == concept_id && item._source.lexical_class.language.id == lang_id;
        });
        self.set('_lexeme', Ember.Object.create(entry._source));
      });

      //self.get('store').find('lexeme', {
        //concept: self.get('concept').get('id'),
        //lexical_class__language: self.get('language').get('id')
      //}).then(function(lexemes) {
        //self.set('_lexeme', lexemes.objectAt(0)); // there should be only one
      //});
    }
  }.observes('cellContent', 'concept', 'language', 'entries'),

  load_repstring: function() {
    var content = this.get('cellContent');
    var self = this;
    if (content) {
      var concept_id = parseInt(self.get('concept').get('id'));
      var lang_id = parseInt(self.get('language').get('id'));
      self.get('entries').then(function(data) {
        var entry = data.hits.hits.find(function(item) {
          return item._source.concept.id == concept_id && item._source.lexical_class.language.id == lang_id;
        });
        var lemma = entry._source.lexical_forms.find(function(form) {
          return form.is_lemma;
        }).representations.find(function(rep) {
          return rep.representation_type.name == "written"; // WARN: magic word
        });
        self.set('_repstring', lemma.name);
      });
      //self.get('store').find('representation', {
        //lexical_form__lexeme__concept: self.get('concept').get('id'),
        //lexical_form__lexeme__lexical_class__language: self.get('language').get('id')
      //}).then(function(reps) {
        //var repstring = '';
        //reps.forEach(function(rep) {
          //repstring += rep.get('name') + '\n';
        //});
        //self.set('_repstring', repstring);
      //});
    }
  }.observes('cellContent', 'concept', 'language', 'entries')
});
