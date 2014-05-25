/*global Ember*/
Ltm.Lexeme = DS.Model.extend({
    lexId: DS.attr('string'),
    lexicalClass: DS.belongsTo('lexicalclass'),
    concept: DS.belongsTo('concept'),
    notes: DS.hasMany('note', {async: true}),
    forms: DS.hasMany('form', {async: true}),
    lexicalForms: DS.hasMany('lexicalform', {async: true}),
    collections: DS.hasMany('collection', {async: true}),
    lemma: function() {
      var self = this;
      var proxy = Ember.ObjectProxy.create({});
      Ltm.entries.search({
        from: 0,
        size: 1,
        query: {
          match: {id: self.get('id')}
        }
      }).then(function(data){
        var entry = Ember.Object.create(data.hits.hits[0]._source);
        // Set wrtten representation
        entry.get('lexical_forms').forEach(function(lex_form) {
          lex_form.written_representation = lex_form.representations
                                                    .find(function(rep) {
                                                      return rep.representation_type.name == 'written'; // note magic word
                                                    });
        });
        // Get lemma
        var lemma = entry.get('lexical_forms')
                         .findBy('is_lemma')
                         .written_representation
                         .name;
        proxy.set('content', {name: lemma});
      });
        return proxy;
    }.property('lexicalForms.@each')
});

// probably should be mixed-in...
Ltm.Lexeme.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
