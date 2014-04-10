/*global Ember*/
Ltm.Lexeme = DS.Model.extend({
    lexId: DS.attr('string'),
    lexicalClass: DS.belongsTo('lexicalclass'),
    concept: DS.belongsTo('concept'),
    notes: DS.hasMany('note', {async: true}),
    forms: DS.hasMany('form', {async: true}),
    lexicalForms: DS.hasMany('lexicalform', {async: true}),
    collections: DS.hasMany('collection', {async: true})
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
