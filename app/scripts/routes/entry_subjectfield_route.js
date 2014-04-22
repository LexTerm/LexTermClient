Ltm.EntrySubjectfieldRoute = Ember.Route.extend({

  model: function(params) {
    return this.get('store').createRecord('subjectfield', {});
  },

  actions: {
    save: function() {
      var subject = this.modelFor('entry.subjectfield');
      subject.save().then(function() {
        window.location.reload();
      });
      this.transitionTo('entry');
    }
  }

});
