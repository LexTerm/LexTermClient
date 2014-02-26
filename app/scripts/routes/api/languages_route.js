Ltm.LanguagesRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('language');
  }
});

