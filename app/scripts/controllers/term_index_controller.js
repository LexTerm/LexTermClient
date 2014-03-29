Ltm.TermIndexController = Ember.Controller.extend({
  needs: 'collection',
  start: 0,
  scrollSize: 10,
  numRows: 10,

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
                terms: {"lexical_class.language.locale": this.get('activeLanguages').mapBy('locale')}
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

      var entries_promise = Ltm.entries.search({
          from: this.get('start'),
          size: this.get('numRows') * this.get('activeLanguages').toArray().length,
          sort: "concept.id",
          query: query
        });

      var control = this;
      entries_promise.then(function(data) {
        var total = data.hits.total;
        var num_rows = control.get('numRows');
        var num_langs = control.get('activeLanguages').toArray().length;
        var num_pages = Math.ceil(total/ (num_rows * num_langs));
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
        if (!pages.findBy('active')) {
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
    }.property('model', 'start', 'numRows', 'activeLanguages.@each', 'activeSubjectFields.@each'),

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
