Ltm.LexicalclassesRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('lexicalclass');
  }
});

