Ltm.RepresentationtypesRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('representationtype');
  }
});

