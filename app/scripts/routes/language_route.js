Ltm.LanguageRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('language', params.language_id);
  }
});

