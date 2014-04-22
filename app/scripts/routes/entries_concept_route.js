Ltm.EntriesConceptRoute = Ember.Route.extend({

  model: function(params) {
    return this.get('store').createRecord('concept', {});
  },

  renderTemplate: function() {
    this.render('entry/concept');
  },

  actions: {
    save: function() {
      var self = this;
      var concept = this.modelFor('entries.concept');
      concept.save().then(function() {
        self.transitionTo('entries');
      });
    }
  }

});
