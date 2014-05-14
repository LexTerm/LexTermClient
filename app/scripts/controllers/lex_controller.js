Ltm.LexController = Ember.ArrayController.extend({
  needs: 'collection',
  _query_term: null,

  queryTerm: function (key, value) {
    if (value) {
      this.set('_query_term', value.toLowerCase());
    }
    return this.get('_query_term');
  }.property('_query_term'),

  setQueryTerm: function(value) {
    this.set('queryTerm', value);
  },

  collection: function() {
    return this.get('controllers.collection.model');
  }.property()
});
