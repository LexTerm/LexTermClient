Ltm.TermIndexRoute = Ember.Route.extend({
    model: function(params) {
        var self = this;
        var term_model = this.modelFor('term');
        return Ember.RSVP.Promise.cast(term_model).then(
            function(model) {
                var collection = model.collection;
                return Ember.RSVP.hash({
                  collection: model.collection,
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
            }).catch(
            function (reason) {
              console.log(reason);
              //too much data
              //return Ember.RSVP.hash({
                //concepts: self.get('store').find('concept'),
                //languages: self.get('store').find('language'),
                //lexicalClasses: self.get('store').find('lexicalclass'),
                //lexemes: self.get('store').find('lexeme'),
                //lexicalForms: self.get('store').find('lexicalform'),
                //subjectFields: self.get('store').find('subjectfield'),
                //representations: self.get('store').find('representation')
              //});
            });
    }
});
