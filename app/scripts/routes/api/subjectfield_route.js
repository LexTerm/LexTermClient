Ltm.SubjectfieldRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('subjectfield', params.subjectfield_id);
  }
});

