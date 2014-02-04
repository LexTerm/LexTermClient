Ltm.TermRoute = Ember.Route.extend({
  model: function(params) {
    if (params.collection_id == 'all') {
        return this.get('store').find('concept');
    } else {
        //TODO make the right query
        var collection = this.get('store').find('collection', params.collection_id);
        return collection.get('lexemes');
    }
  }
});
