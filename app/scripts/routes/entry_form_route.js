Ltm.EntryFormRoute = Ember.Route.extend({

  model: function(params) {
    return this.get('store').createRecord('form', {});
  },

  actions: {
    save: function() {
      var form = this.modelFor('entry.form');
      form.save().then(function() {
        window.location.reload();
      });
      this.transitionTo('entry');

    }
  }
});
