Ltm.FeatureEditController = Ember.ObjectController.extend({
  needs: 'feature',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.feature.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('feature',this.get('model'));
    }
  }
});

