Ltm.ConceptRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('concept', params.concept_id);
  }
});

