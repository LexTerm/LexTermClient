/*global Ember*/
Ltm.Form = DS.Model.extend({
    name: DS.attr('string'),
    lexemes: DS.hasMany('lexeme'),
    lexicalForms: DS.hasMany('lexicalform'),
    features: DS.hasMany('featurevalue')
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
