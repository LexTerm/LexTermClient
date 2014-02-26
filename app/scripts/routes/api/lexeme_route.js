Ltm.LexemeRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('lexeme', params.lexeme_id);
  }
});

