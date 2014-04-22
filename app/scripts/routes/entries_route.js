Ltm.EntriesRoute = Ember.Route.extend({
  model: function() {
      return this.store.createRecord('lexeme');
  }

});
