Ltm.EntriesController = Ember.ObjectController.extend({
  needs: 'collection',

  collection: function() {
    return this.get('controllers.collection.model');
  }.property(),

  concepts: function() {
    return this.get('store').find('concept');
  }.property('model'),

  languages: function() {
    return this.get('store').find('language');
  }.property('model'),

  forms: function() {
    return this.get('store').find('form');
  }.property('model'),

  writtenType: function() {
    return this.get('store').find('representationtype', {
      name: 'written' // magic word
    });
  }.property('model'),

  saveRepresentation: function(lexeme, form) {
    var self = this;
    var lex_form = self.get('store').createRecord('lexicalform', {
      isLemma: true,
      form: form,
      lexeme: lexeme
    });
    lex_form.save().then(function() {
      self.get('writtenType').then(function(rep_type) {
        rep_type = rep_type.get('firstObject');
        if (!rep_type) {
          self.get('store').createRecord('representationtype', {name: 'written'}).save(function(rep_type) {
            var rep = self.get('store').createRecord('representation', {
              representationType: rep_type,
              lexicalForm: lex_form,
              name: self.get('lemmaName')
            });
            rep.save().then(function() {
              window.location.reload();
            });
          });
        } else {
          var rep = self.get('store').createRecord('representation', {
            representationType: rep_type,
            lexicalForm: lex_form,
            name: self.get('lemmaName')
          });
          rep.save().then(function() {
            window.location.reload();
          });
        }
      });
    });

  },

  saveLexForm: function(lexeme) {
    var self = this;
    self.get('forms').then(function(forms) {
      var form = forms.findBy('name', '*'); // magic word
      if (!form) {
        form = self.get('store').createRecord('form', {
          name: '*'
        });
        form.save().then(function(form) {
          self.saveRepresentation(lexeme, form);
        });
      } else {
        self.saveRepresentation(lexeme, form);
      }
    });
  },

  actions: {
    save: function() {
      var self = this;
      var lexeme = self.get('model');
      lexeme.get('collections').then(function(collections) {collections.pushObject(self.get('collection'));});
      var language = self.get('language');
      language.get('lexicalClasses').then(function(lex_classes) {
        var lex_class = lex_classes.findBy('name', '*'); // magic word
        if (!lex_class) {
          lex_class = self.get('store').createRecord('lexicalclass', {
            name: '*',
            language: language
          });

          lex_class.save().then(function() {
            lexeme.set('lexicalClass', lex_class);
            lexeme.save().then(function() {
              self.saveLexForm(lexeme);
              self.transitionToRoute('entry', lexeme);
            });
          });
        } else {
          lexeme.set('lexicalClass', lex_class);
          lexeme.save().then(function() {
            self.saveLexForm(lexeme);
            self.transitionToRoute('entry', lexeme);
          });
        }
      });
    }
  }


});
