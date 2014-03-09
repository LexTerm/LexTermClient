Ltm.LexEntryController = Ember.Controller.extend({
  needs: 'collection',

  start: 0,
  numRows: 5,

  collection: function() {
    return this.get('controllers.collection.model');
  }.property(),

  entries: function() {
    var self = this;
    var entries = Ember.ArrayProxy.create({content: [Ember.Object.create()]
    });
    this.get('store').find('lexeme', {
      lexical_class__language: this.get('model').get('id'),
      collections: this.get('collection').get('id')
    }).then(function(lexemes) {
      entries.set('content', lexemes.slice(self.get('start'), self.get('start') + self.get('numRows')));
    });
    return entries;
  }.property('collection', 'model')
});
