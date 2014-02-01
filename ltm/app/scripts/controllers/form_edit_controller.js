Ltm.FormEditController = Ember.ObjectController.extend({
  needs: 'form',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.form.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('form',this.get('model'));
    }
  }
});

