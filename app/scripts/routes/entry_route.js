Ltm.EntryRoute = Ember.Route.extend({
  actions: {
    deleteEntry: function() {
      this.controllerFor('entry.delete').set('loading', true);
      var lexeme = this.modelFor('entry');
      lexeme.deleteRecord();
      lexeme.save();
      Ember.run.later(this, function() {
        var collection = this.modelFor('collection');
        this.transitionTo('term').then(function() {
          window.location.reload();
        });
      }, 1000);
    }
  }
});
