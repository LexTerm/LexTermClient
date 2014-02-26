Ltm.TermIndexRoute = Ember.Route.extend({
  model: function(params) {
    var collection = this.modelFor('collection');
    return this.get('store').find('concept', {
      lexemes__collections: collection.get('id')
    });
  }
});
