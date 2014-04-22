Ltm.EntryLexicalclassRoute = Ember.Route.extend({

  model: function(params) {
    return this.get('store').createRecord('lexicalclass', {});
  },

  actions: {
    save: function() {
      var lexical_class = this.modelFor('entry.lexicalclass');
      lexical_class.save().then(function() {
        window.location.reload();
      });
      this.transitionTo('entry');

    }
  }

});
