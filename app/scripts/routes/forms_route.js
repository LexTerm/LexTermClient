Ltm.FormsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('form');
  }
});

