Ltm.TermRoute = Ember.Route.extend({
    model: function(params) {
        var self = this;
        return self.get('store').find('collection', params.collection_id).then(
            function(collection) {
                return Ember.RSVP.hash({
                  collection: collection,
                  concepts: self.get('store').find(
                      'concept', {'lexemes__collections': collection.get('id')}),
                  languages: self.get('store').find(
                      'language', {'lexical_classes__lexemes__collections': collection.get('id')}),
                  lexicalClasses: self.get('store').find(
                      'lexicalclass', {'lexemes__collections': collection.get('id')}),
                  lexemes: self.get('store').find(
                      'lexeme', {'collections': collection.get('id')}),
                  lexicalForms: self.get('store').find(
                      'lexicalform', {'lexeme__collections': collection.get('id')}),
                  subjectFields: self.get('store').find(
                      'subjectfield', {'concepts__lexemes__collections': collection.get('id')}),
                  representations: self.get('store').find(
                      'representation', {'lexical_form__lexeme__collections': collection.get('id')})
                });
            },
            function () {
              return false;
            });
    },

    setupController: function(controller, model) {
      console.log('called yeah');
      var self = this;
      Ember.RSVP.Promise.cast(model).then(
          function(model) {
            console.log('got model');
            if (model) {
              console.log('returning');
              console.log(model);
              return model;
            } else {
              console.log('returning hash');
              return Ember.RSVP.hash({
                concepts: self.get('store').find('concept'),
                languages: self.get('store').find('language'),
                lexicalClasses: self.get('store').find('lexicalclass'),
                lexemes: self.get('store').find('lexeme'),
                lexicalForms: self.get('store').find('lexicalform'),
                subjectFields: self.get('store').find('subjectfield'),
                representations: self.get('store').find('representation')
              }).then(function(model) {
            console.log('setting model');
            controller.set('model', model);
        });
            }
        });
    },

    renderTemplate: function() {
        this.render(); //term template
        this.render('header', {outlet: 'header'});
    }

});
