Ltm.LexicalClassEditController = Ember.ObjectController.extend({
  needs: 'lexicalclass',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.lexicalclass.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('lexicalclass',this.get('model'));
    }
  }
});

