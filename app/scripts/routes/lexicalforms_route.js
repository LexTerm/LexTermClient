Ltm.LexicalformsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('lexicalform');
  }
});

