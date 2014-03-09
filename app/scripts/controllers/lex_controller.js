Ltm.LexController = Ember.ArrayController.extend({
  needs: 'collection',
  collection: function() {
    return this.get('controllers.collection.model');
  }.property()
});
