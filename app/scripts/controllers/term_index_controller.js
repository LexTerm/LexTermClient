Ltm.TermIndexController = Ember.Controller.extend({
  needs: 'collection',
  start: 0,
  scrollSize: 10,
  numRows: 10,
  _query_term: null,

  pages: [],

  queryTerm: function (key, value) {
    if (value) {
      this.set('_query_term', value.toLowerCase());
    }
    return this.get('_query_term');
  }.property('_query_term'),

  setQueryTerm: function(value) {
    this.set('queryTerm', value);
  },

  adjustLimit: function(value) {
    this.set('numRows', value);
  },

  adjustStart: function(value) {
    this.set('start', value);
  },

  collection: function() {
    return this.get('controllers.collection.model');
  }.property(),

  activeLanguages: [],

  languages: function() {
    return this.get('store').find('language', {
        lexical_classes__lexemes__collections: this.get('model').get('id')
      });
  }.property('model'),

  activeSubjectFields: [],

  subjectFields: function() {
    //TODO fix the old collection as model reference and probably upgrade to using the index
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
      var query = {
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
              and: [{
                match_all: {}
              }]
            }
          }
        };

      if (this.get('activeSubjectFields').length) {
        query.filtered.filter.and.push({
          nested: {
            path: "concept.subject_fields",
            filter: {
              terms: {"concept.subject_fields.id": this.get('activeSubjectFields').mapBy('id')}
            }
          }
        });
      }

      if (this.get('activeLanguages').length) {
        query.filtered.filter.and.push({
          terms: {"lexical_class.language.locale": this.get('activeLanguages').mapBy('locale')}
        });
      }

      if (this.get('queryTerm')) {
        query.filtered.filter.and.push({
          nested: {
            path: "lexical_forms.representations",
            filter: {
              prefix: {"lexical_forms.representations.name": this.get('queryTerm')}
            }
          }
        });
      }

      var size_factor = this.get('activeLanguages').toArray().length || 1;

      var entries_promise = Ltm.entries.search({
          from: this.get('start'),
          size: this.get('numRows') * size_factor,
          sort: "concept.id",
          query: query
        });

      var control = this;
      entries_promise.then(function(data) {
        var total = data.hits.total;
        var num_rows = control.get('numRows');
        var num_langs = size_factor;
        var num_pages = total ? Math.ceil(total / (num_rows * num_langs)) : 0;
        var current_page_value = control.get('start');
        var pages = Array(num_pages);
        for (var pind = 0; pind < num_pages; pind++) {
          var page_value = pind * num_rows * num_langs;
          if (page_value == current_page_value) {
            pages[pind] = Ember.Object.create({active: true, value: page_value, index: pind + 1});
          } else {
            pages[pind] = Ember.Object.create({active: false, value: page_value, index: pind + 1});
          }
        }
        if (!pages.findBy('active') && pages.length) {
          pages.get('lastObject').set('active', true);
        }
        control.set('pages', pages);
      });

      return this.get('entriesProxy').create({
        content: [],
        languages: this.get('activeLanguages'),
        size: this.get('scrollSize'),
        entries: entries_promise
      });
    }.property('model', 'start', 'numRows', 'queryTerm', 'activeLanguages.@each', 'activeSubjectFields.@each'),

    entriesProxy: Ember.ArrayProxy.extend({
      objectAtContent: function(index) {
        var self = this;
        var content = self.get('content');
        var row = content[index];
        if (row) {
          return row;
        } else {
          // set placeholders
          var size = self.get('size');
          var rows = [];

          var setDefaultLocale = function (lang) {
              nrow.set(lang.get('locale'), {});
            };

          for (var rind = 0; rind < size; rind++) {
            var nrow = Ember.Object.create({
              definition: '',
              id: ''
            });

            self.get('languages').forEach(setDefaultLocale);

            rows.push(nrow);
          }
          self.set('content', rows);

          // load actual entries
          self.get('entries').then(function(data) {
            var rows = [];
            var current;
            entries = data.hits.hits;
            entries.forEach(function(entry) {
              var eid = entry._source.concept.id;
              var locale;
              if (eid == current) {
                locale = entry._source.lexical_class.language.locale;
                rows.get('lastObject').set(locale, entry);
              } else {
                current = eid;
                var new_row = Ember.Object.create({
                  definition: entry._source.concept.definition,
                  id: entry._source.concept.concept_id
                });
                locale = entry._source.lexical_class.language.locale;
                new_row.set(locale, entry);
                rows.pushObject(new_row);
                self.set('content', rows);
              }
            });
          });
        }
      }
    })
});
