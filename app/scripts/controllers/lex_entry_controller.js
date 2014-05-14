Ltm.LexEntryController = Ember.Controller.extend({
  needs: ['collection', 'lex'],

  start: 0,
  numRows: 5,

  pages: [],

  searchCompleted: true,

  adjustLimit: function(value) {
    this.set('numRows', value);
  },

  adjustStart: function(value) {
    this.set('start', value);
  },

  collection: function() {
    return this.get('controllers.collection.model');
  }.property('model'),

  queryTerm: function() {
    return this.get('controllers.lex.queryTerm');
  }.property('controllers.lex.queryTerm'),

  entries: function() {
    var self = this;
    self.set('searchCompleted', false);
    var entries = Ember.ArrayProxy.create({content: []});
    var query_term = self.get('queryTerm');
    var filter;
    if (query_term) {
      filter = {
        and: [
          {
            term: {"lexical_class.language.locale": this.get('model').get('locale')}
          },
          {
            nested: {
              path: "lexical_forms.representations",
              filter: {
                prefix: {"lexical_forms.representations.name": query_term}
              }
            }
          }
        ]
      };
    } else {
      filter = {
        term: {"lexical_class.language.locale": this.get('model').get('locale')}
      };
    }
    Ltm.entries.search({
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
          filter: filter
        }
      }
    }).then(function(data) {
      self.set('searchCompleted', true);
      // Set pagination
      var total = data.hits.total;
      var num_pages = total ? Math.ceil(total / self.get('numRows')) : 0;
      var current_page_value = self.get('start');
      var pages = Array(num_pages);
      for (var pind = 0; pind < num_pages; pind++) {
        var page_value = pind * self.get('numRows');
        if (page_value == current_page_value) {
          pages[pind] = Ember.Object.create({active: true, value: page_value, index: pind + 1});
        } else {
          pages[pind] = Ember.Object.create({active: false, value: page_value, index: pind + 1});
        }
      }
      if (!pages.findBy('active') && pages.length) {
        pages.get('lastObject').set('active', true);
      }
      self.set('pages', pages);

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
  }.property('collection', 'model', 'numRows', 'start', 'queryTerm')

});
