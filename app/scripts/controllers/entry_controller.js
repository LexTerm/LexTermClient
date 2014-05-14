Ltm.EntryController = Ember.ObjectController.extend({
  needs: 'collection',
  proposedSubjectField: null,

  actions: {
    editLexId: function(value) {
      var lexeme = this.get('model');
      lexeme.set('lexeId', value);
      lexeme.get('collections').then(function() {
        // we need to guarantee that the collections are loaded or they will be clobbered by the update
        lexeme.save();
      });
    },

    editDefinition: function(value) {
      var concept = this.get('model.concept');
      concept.set('definition', value);
      concept.save();
    },

    removeSubjectField: function(field) {
      var concept = this.get('model.concept');
      concept.get('subjectFields').removeObject(field);
      concept.save();
    },

    updateFormListeners: function() {
      this.propertyWillChange('filteredForms');
      this.propertyDidChange('filteredForms');
    }
  },

  collection: function() {
    return this.get('controllers.collection.model');
  }.property('model'),

  writtenType: function() {
    return this.get('store').find('representationtype', {
      name: 'written' // magic word
    });
  }.property('model'),

  languages: function() {
    return this.get('store').find('language');
  }.property('model'),

  concepts: function() {
    return this.get('store').find('concept');
  }.property('model'),

  forms: function() {
    return this.get('store').find('form');
  }.property('model'),

  filteredForms: function() {
    var current_lex_forms = this.get('model.lexicalForms');
    var current_forms = current_lex_forms.map(function(lex_form) {
      return lex_form.get('form');
    });

    var out = Ember.ArrayProxy.create({});
    var all_forms = this.get('forms');
    all_forms.then(function(forms) {
      var filtered = forms.filter(function(form) {
        return !current_forms.contains(form);
      });
      out.set('content', filtered);
    });
    return out;

  }.property('forms', 'model.lexicalForms.@each'),

  subjectFields: function() {
    return this.get('store').find('subjectfield');
  }.property('model'),

  filteredSubjectFields: function() {
    var concept_fields = this.get('model.concept.subjectFields');
    var all_fields = this.get('subjectFields');
    return all_fields.filter(function(field) {
      return !concept_fields.contains(field);
    });

  }.property('subjectFields', 'model.concept.subjectFields.@each'),

  nextLanguage: function(key, value) {
    var self = this;
    var lexeme = self.get('model');
    if (value) {
      value.get('lexicalClasses').then(function(lex_classes) {
        var lex_class = lex_classes.findBy('name', '*'); // magic word
        if (!lex_class) {
          lex_class = self.get('store').createRecord('lexicalclass', {
            name: '*',
            language: value
          });
          lex_class.save().then(function() {
            lexeme.set('lexicalClass', lex_class);
            lexeme.save();
          });
        } else {
          lexeme.set('lexicalClass', lex_class);
          lexeme.save();
        }
      });
    }
    return lexeme.get('lexicalClass.language');
  }.property('model.lexicalClass.language'),

  nextConcept: function(key, value) {
    var lexeme = this.get('model');
    if (value) {
      lexeme.set('concept', value);
      lexeme.save();
    }
    return lexeme.get('concept');
  }.property('model.concept'),


  nextLexicalClass: function(key, value) {
    var lexeme = this.get('model');
    if (value) {
      lexeme.set('lexicalClass', value);
      lexeme.save();
    }
    return lexeme.get('lexicalClass');
  }.property('model.lexicalClass'),

  nextLexicalForm: function(key, value) {
    var self = this;
    if (value) {
      var lex_forms = self.get('model.lexicalForms');
      var is_lemma = lex_forms.length < 1;
      var lex_form = self.get('store').createRecord('lexicalform', {
        isLemma: is_lemma,
        form: value,
        lexeme: self.get('model')
      });
      lex_form.save().then(function() {
        self.get('writtenType').then(function(rep_type) {
          rep_type = rep_type.get('firstObject');
          var rep = self.get('store').createRecord('representation', {
            representationType: rep_type,
            lexicalForm: lex_form
          });
          rep.save().then(function() {
            window.location.reload();
          });
        });
      });
    }

    return null;
  }.property('model.lexicalForms.@each', 'writtenType'),

  subjectFieldObserver: function() {
    if (this.get('proposedSubjectField')) {
      this.get('model.concept.subjectFields').pushObject(this.get('proposedSubjectField'));
      this.get('model.concept').save();
      this.set('proposedSubjectField', null);
    }
  }.observes('proposedSubjectField')


});
