Ltm.TermIndexRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('collection');
  }
});
