Ltm.TermIndexController = Ember.Controller.extend({
  needs: 'collection',
  start: 0,
  numRows: 20,

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
      var self = this;
      var end = this.get('numRows') + this.get('start');
      var concepts = this.get('model').filter(function(concept) {
        console.log(concept);
        console.log(concept.get('subjectFields'));
        return self.get('activeSubjectFields').any(function(subjectfield) {
          var out = false;
          concept.get('subjectFields').forEach(function(field) {
            //TODO: determine if we are async here
            console.log(field);
            console.log(subjectfield);
            console.log(field == subjectfield);
            if (field == subjectfield) {
              out = true;
            }
          });
          console.log(out);
          return out;
        });
      });

      var entries_promise;
      if (!concepts.length) {
        concepts = self.get('model').sortBy('id').slice(self.get('start'), end);
        var entries_promise = Ltm.entries.search({
          from: self.get('start'),
          size: self.get('numRows') * self.get('activeLanguages').toArray().length,
          query: {
            filtered: {
              query: {
                nested: {
                  path: "collections",
                  query: {
                    match: {"collections.id": self.get('collection').get('id')}
                  }
                }
              },
              filter: {
                and: [
                  {terms: {
                    "lexical_class.language.locale": self.get('activeLanguages').mapBy('locale')
                    }
                  },
                  {terms: {
                    "concept.id": concepts.map(function(concept) { return parseInt(concept.get('id')) })
                    }
                  }
                ]
              }
            }
          }
        });
      } else {
        concepts = concepts.sortBy('id').slice(self.get('start'), end);
        var entries_promise = Ltm.entries.search({
          from: self.get('start'),
          size: self.get('numRows') * self.get('activeLanguages').toArray().length,
          query: {
            filtered: {
              query: {
                nested: {
                  path: "collections",
                  query: {
                    match: {"collections.id": self.get('collection').get('id')}
                  }
                }
              },
              filter: {
                and: [{
                  nested: {
                      path: "concept.subject_fields",
                      filter: {
                        terms: {"concept.subject_fields.id": self.get('activeSubjectFields').mapBy('id')}
                      }
                    }
                  },
                  {
                  terms: {
                      "lexical_class.language.locale": self.get('activeLanguages').mapBy('locale')
                    }
                  },
                  {terms: {
                    "concept.id": concepts.map(function(concept) { return parseInt(concept.get('id')) })
                    }
                  }
                ]
              }
            }
          }
        });
      }

      return concepts.map(function(concept) {
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
              entries: entries_promise,
              store: self.get('store')
            })
          );
        });
        return row;
      });
    }.property('model', 'start', 'numRows', 'activeLanguages.@each', 'activeSubjectFields.@each')

});
