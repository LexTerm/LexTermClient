Ltm.EntryFormController = Ember.ObjectController.extend({

  allFeatures: function() {
    return this.get('store').find('featurevalue');
  }.property('model'),

  newFeatures: function() {
    var out = Ember.ArrayProxy.create({});
    Ember.RSVP.hash({
      all_features: this.get('allFeatures'),
      model_features: this.get('model.features')
    }).then(function(data) {
      var model_feature_types = data.model_features.map(function(featurevalue) {
         return featurevalue.get('feature');
      });
      new_features = data.all_features.filter(function(feature) {
        return (!data.model_features.contains(feature) &&
                !model_feature_types.contains(feature.get('feature')));
      });
      out.set('content', new_features);
    });
    return out;
  }.property('model', 'allFeatures.@each', 'model.features.@each'),

});
