Ltm.EntryLanguageRoute = Ember.Route.extend({

  model: function(params) {
    return this.get('store').createRecord('language', {});
  },

  actions: {
    save: function() {
      var language = this.modelFor('entry.language');
      language.save().then(function() {
        window.location.reload();
      });
      this.transitionTo('entry');

    }
  }
});
