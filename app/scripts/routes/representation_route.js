Ltm.RepresentationRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('representation', params.representation_id);
  }
});

