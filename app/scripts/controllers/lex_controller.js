Ltm.LexController = Ember.Controller.extend({

  languages: function() {
    var model = this.get('model');
    if (model.collection) {
      return this.store.find('language', {
        lexical_classes__lexemes__collections: model.collection.get('id')
      });
    } else {
      console.log('handle the case of all after pagination is implemented');
    }
  }.property('model')

});
