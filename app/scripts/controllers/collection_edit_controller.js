Ltm.CollectionEditController = Ember.ObjectController.extend({
  needs: 'collection',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.collection.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('collection',this.get('model'));
    }
  }
});

