Ltm.FormRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('form', params.form_id);
  }
});

