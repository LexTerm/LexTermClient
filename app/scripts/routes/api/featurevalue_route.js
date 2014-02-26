Ltm.FeaturevalueRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('featurevalue', params.featurevalue_id);
  }
});

