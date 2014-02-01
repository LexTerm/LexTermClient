Ltm.LexicalclassRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('lexicalclass', params.lexicalclass_id);
  }
});

