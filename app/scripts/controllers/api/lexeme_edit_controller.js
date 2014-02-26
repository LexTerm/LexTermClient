Ltm.LexemeEditController = Ember.ObjectController.extend({
  needs: 'lexeme',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.lexeme.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('lexeme',this.get('model'));
    }
  }
});

