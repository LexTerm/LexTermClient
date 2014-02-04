Ltm.RepresentationtypeRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('representationtype', params.representationtype_id);
  }
});

