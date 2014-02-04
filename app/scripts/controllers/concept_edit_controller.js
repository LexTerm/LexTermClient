Ltm.ConceptEditController = Ember.ObjectController.extend({
  needs: 'concept',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.concept.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('concept',this.get('model'));
    }
  }
});

