Ltm.NoteEditController = Ember.ObjectController.extend({
  needs: 'note',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.note.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('note',this.get('model'));
    }
  }
});

