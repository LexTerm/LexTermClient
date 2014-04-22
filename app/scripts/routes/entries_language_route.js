Ltm.EntriesLanguageRoute = Ember.Route.extend({

  model: function() {
    return this.get('store').createRecord('language');
  },

  renderTemplate: function() {
    this.render('entry/language');
  },

  actions: {
    save: function() {
      var self = this;
      var language = this.modelFor('entries.language');
      language.save().then(function() {
        self.transitionTo('entry');
      });
    }
  }

});
