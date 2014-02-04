Ltm.FeatureValueEditController = Ember.ObjectController.extend({
  needs: 'featurevalue',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.featurevalue.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('featurevalue',this.get('model'));
    }
  }
});

