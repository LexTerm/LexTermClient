Ltm.LexEntryRoute = Ember.Route.extend({
  afterModel: function(model) {
    this.controllerFor('lex').set('queryTerm', null);
  }
});
