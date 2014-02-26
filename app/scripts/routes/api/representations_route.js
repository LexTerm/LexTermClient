Ltm.RepresentationsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('representation');
  }
});

