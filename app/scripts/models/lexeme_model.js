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
      this.get('store').find('representation', {
          lexical_form__lexeme: self.get('id'),
          lexical_form__is_lemma: true,
          representation_type__name: 'written'
      }).then(function(reps) {
        var rep = reps.get('firstObject');
        if (!self.get('id')) {
          proxy.set('content', {name: '* * * New Entry * * *'});
        } else {
          proxy.set('content', rep);
        }
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
