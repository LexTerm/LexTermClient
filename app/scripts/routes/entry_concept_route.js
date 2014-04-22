Ltm.EntryConceptRoute = Ember.Route.extend({

  model: function(params) {
    return this.get('store').createRecord('concept', {});
  },

  actions: {
    save: function() {
      var concept = this.modelFor('entry.concept');
      concept.save().then(function() {
        window.location.reload();
      });

      this.transitionTo('entry');
    }
  }

});
