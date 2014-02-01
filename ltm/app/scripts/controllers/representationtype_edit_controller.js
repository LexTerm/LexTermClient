Ltm.RepresentationTypeEditController = Ember.ObjectController.extend({
  needs: 'representationtype',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.representationtype.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('representationtype',this.get('model'));
    }
  }
});

