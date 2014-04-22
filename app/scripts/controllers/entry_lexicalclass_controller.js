Ltm.EntryLexicalclassController = Ember.ObjectController.extend({
  //TODO use a mixin between entry_controller
  languages: function() {
    return this.get('store').find('language');
  }.property('model')
});
