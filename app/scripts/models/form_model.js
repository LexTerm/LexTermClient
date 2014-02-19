/*global Ember*/
Ltm.Form = DS.Model.extend({
    name: DS.attr('string'),
    lexemes: DS.hasMany('lexeme', {async: true}),
    lexicalForms: DS.hasMany('lexicalform', {async: true}),
    features: DS.hasMany('featurevalue', {async: true})
});

// probably should be mixed-in...
Ltm.Form.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
