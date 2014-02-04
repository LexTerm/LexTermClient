Ltm.FeatureRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('feature', params.feature_id);
  }
});

