Ltm.SubjectfieldsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('subjectfield');
  }
});

