Ltm.EntryFeaturesController = Ember.ObjectController.extend({

  actions: {
    save: function() {
      var feature = this.get('feature');
      var value = this.get('value');
      if (feature && value) {
        value.set('feature', feature);
        feature.save().then(function() {
          value.save().then(function() {
            window.location.reload();
          });
        });
        this.transitionTo('entry');
      }
    }
  },

  features: function() {
    return this.get('store').find('feature');
  }.property('model'),

  values: function() {
    return this.get('store').find('featurevalue');
  }.property('model'),

  feature: function(key, value) {
    var feature = this.get('model.feature');
    if (value) {
      try {
        feature = this.get('store').createRecord('feature', value);
      } catch(err) {
        feature = value;
      }
      this.get('model').set('feature', feature);
    }
    return feature;
  }.property('model'),

  value: function(key, value) {
    var feature_value = this.get('model.feature_value');

    if (value) {
      try {
        feature_value = this.get('store').createRecord('featurevalue', value);
      } catch(err) {
        feature_value = value;
      }
      this.get('model').set('feature_value', feature_value);
    }
    return feature_value;
  }.property('model')


});
