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
        //TODO localize
        var proxy = Ember.Object.create({name: "Loading..."});
        this.get('store').find('representation', {
            lexical_form__lexeme: this.get('id'),
            lexical_form__is_lemma: true,
            representation_type__name: 'written'
        }).then(function(reps) {
          var rep = reps.get('firstObject');
          proxy.set('name', rep.get('name'));
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
