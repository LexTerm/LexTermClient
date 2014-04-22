Ltm.NewEntryRoute = Ember.Route.extend({
  
  beforeModel: function() {
    var self = this;
    return self.get('store').find('collection', {
      name: 'All',
    }).then(function(data) {
      var collection = data.get('firstObject'); 
      if (!collection) {
        return self.get('store').createRecord('collection', {
          name: 'All'
        }).save(); 
      } else {
        return collection;
      }
    }).then(function(collection) {
      self.transitionTo('entries', collection.get('id'));
    });
  }
});
