Ltm.LexRoute = Ember.Route.extend({
  model: function(params) {
    var collection = this.modelFor('collection');
    return this.get('store').find('language', {
      lexical_classes__lexemes__collections: collection.get('id')
    });
  }

});
