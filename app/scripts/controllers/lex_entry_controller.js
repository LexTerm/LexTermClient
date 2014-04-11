Ltm.LexEntryController = Ember.Controller.extend({
  needs: 'collection',

  start: 0,
  scrollSize: 10,
  numRows: 5,

  pages: [],

  adjustLimit: function(value) {
    this.set('numRows', value);
  },

  adjustStart: function(value) {
    this.set('start', value);
  },

  collection: function() {
    return this.get('controllers.collection.model');
  }.property(),

  entries: function() {
    var self = this;
    var entries = Ember.ArrayProxy.create({content: []});
    var hi = Ltm.entries.search({
      from: this.get('start'),
      size: this.get('numRows'),
      sort: "lexical_forms.representations.name",
      query: {
        filtered: {
          query: {
            nested: {
              path: "collections",
              query: {
                match: {"collections.id": this.get('collection').get('id')}
              }
            }
          },
          filter: {
              term: {"lexical_class.language.locale": this.get('model').get('locale')}
          }
        }
      }
    }).then(function(data) {
      console.log(data);
      entries.set('content', data.hits.hits.map(function(hit) {
        var entry = Ember.Object.create(hit._source);
        // Set wrtten representation
        entry.get('lexical_forms').forEach(function(lex_form) {
          lex_form.written_representation = lex_form.representations
                                                    .find(function(rep) {
                                                      return rep.representation_type.name == 'written'; // note magic word
                                                    });
        });
        // Get lemma
        var lemma = entry.get('lexical_forms')
                         .findBy('is_lemma')
                         .written_representation
                         .name;
        entry.set('name', lemma);
        return entry;
      }));
    }).catch(function(err) {
      console.log(err);
    });
    return entries;
  }.property('collection', 'model'),

  columns: function() {
    var columns = [];
    columns.pushObject(Ember.Table.ColumnDefinition.create({
      headerCellName: 'Lexical ID', //TODO localize all of these
      contentPath: 'lex_id'
    }));
    columns.pushObject(Ember.Table.ColumnDefinition.create({
      headerCellName: 'Lemma',
      contentPath: 'name'
    }));
    columns.pushObject(Ember.Table.ColumnDefinition.create({
      headerCellName: 'Lexical Class',
      contentPath: 'lexical_class.name'
    }));
    columns.pushObject(Ember.Table.ColumnDefinition.create({
      headerCellName: 'Concept',
      contentPath: 'concept.concept_id'
    }));
    columns.pushObject(Ember.Table.ColumnDefinition.create({
      headerCellName: 'Subject Fields',
      contentPath: 'concept.subject_fields'
    }));
    columns.pushObject(Ember.Table.ColumnDefinition.create({
      headerCellName: 'Forms',
      contentPath: 'lexical_forms'
    }));
    return columns;
  }.property('entries.@each'),

  rows: function() {
    return this.get('entries');
  }.property('entries.@each')
});
