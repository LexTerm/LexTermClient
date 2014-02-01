Ltm.RepresentationEditController = Ember.ObjectController.extend({
  needs: 'representation',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.representation.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('representation',this.get('model'));
    }
  }
});

