Ltm.LexicalFormComponent = Ember.Component.extend({
  tagName: 'tr',
  isEditing: false,

  nextForm: function(key, value) {
    var lex_form = this.get('lexForm');
    if (value) {
      lex_form.set('form', value);
      lex_form.save();
      this.sendAction('updateFormListeners');
    }
    return lex_form.get('form');
  }.property('lexForm'),

  actions: {
    editWrittenRepresentation: function(value) {
      var self = this;
      var rep = this.get('lexForm.writtenRepresentation');
      self.set('isEditing', true);
      rep.set('name', value);
      rep.get('content').save().then(function() {
        self.set('isEditing', false);
      });
    },

    makeLemma: function(value) {
      var self = this;
      var lex_form = this.get('lexForm');
      self.set('isEditing', true);
      lex_form.set('isLemma', true);
      lex_form.save().then(function() {
        self.set('isEditing', false);
        window.location.reload();
      });
    }
  }

});
