Ltm.NoteRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('note', params.note_id);
  }
});

