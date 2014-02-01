Ltm.SubjectFieldEditController = Ember.ObjectController.extend({
  needs: 'subjectfield',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.subjectfield.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('subjectfield',this.get('model'));
    }
  }
});

