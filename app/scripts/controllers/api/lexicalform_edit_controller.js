Ltm.LexicalformEditController = Ember.ObjectController.extend({
  needs: 'lexicalform',
  actions: {
    save: function(){
      self = this;
      this.get('buffer').forEach(function(attr){
        self.get('controllers.lexicalform.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('lexicalform',this.get('model'));
    }
  }
});

