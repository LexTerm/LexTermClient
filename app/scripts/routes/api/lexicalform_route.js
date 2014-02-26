Ltm.LexicalformRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('lexicalform', params.lexicalform_id);
  }
});

