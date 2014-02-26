Ltm.CollectionRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('collection', params.collection_id);
  }
});

