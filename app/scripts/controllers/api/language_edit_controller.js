Ltm.LanguageEditController = Ember.ObjectController.extend({
  needs: 'language',
  actions: {
    save: function(){
      var self = this;
      this.get('buffer').forEach(function(attr){
        self.get('controllers.language.model').set(attr.key, attr.value);
      });
      this.get('model').save();
      this.transitionToRoute('language',this.get('model'));
    }
  }
});

