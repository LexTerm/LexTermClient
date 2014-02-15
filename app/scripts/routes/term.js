Ltm.TermRoute = Ember.Route.extend({
    model: function(params) {
        // TODO implement pagination via params
        var self = this;
        return self.get('store').find('collection', params.collection_id).then(
            function(collection) {
                return Ember.RSVP.hash({
                  collection: collection,
                  concepts: self.get('store').find(
                      'concept', {'lexemes__collections': collection.get('id')}),
                  languages: self.get('store').find(
                      'language', {'lexical_classes__lexemes__collections': collection.get('id')}),
                  subjectFields: self.get('store').find(
                      'subjectfield', {'concepts__lexemes__collections': collection.get('id')})
                  //representations: self.get('store').find(
                      //'representation', {'lexical_form__lexeme__collections': collection.get('id')})
                });
            },
            function() {
                return Ember.RSVP.hash({
                  concepts: self.get('store').find('concept'),
                  languages: self.get('store').find('language'),
                  subjectFields: self.get('store').find('subjectfield')
                  //representations: self.get('store').find('representation')
                });
            }).then(function(hash) {
                var rep_promises = [];
                var rep_hash = {};
                hash.concepts.forEach(function(concept) {
                    //TODO limit to languages used by concepts
                    rep_hash[concept.get('id')] = rep_hash[concept.get('id')] || {concept: concept, languages: {}};
                    hash.languages.forEach(function(lang) {
                        var repstring = '';
                        rep_hash[concept.get('id')].languages[lang.get('id')] = rep_hash[concept.get('id')].languages[lang.get('id')] || {language: lang, repstring: repstring};
                        rep_promises.push(self.get('store').find(
                            'representation', {
                                lexical_form__lexeme__concept: concept.get('id'),
                                lexical_form__lexeme__lexical_class__language: lang.get('id')
                            }).then(function(reps) {
                                reps.forEach(function(rep) {
                                    repstring += rep.get('name') + "\n"; 
                                }); 
                                return reps;
                            })
                        );
                    });
                });

                return Ember.RSVP.all(rep_promises).then(function(replist) {
                    hash.representations = rep_hash; //not replist
                    return hash; 
                });
            });
    },

    renderTemplate: function() {
        this.render(); //term template
        this.render('header', {outlet: 'header'});
    }

});
