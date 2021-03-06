/*global Ember*/
Ltm.Lexicalclass = DS.Model.extend({
    name: DS.attr('string'),
    language: DS.belongsTo('language'),
    lexemes: DS.hasMany('lexeme', {async: true})
});

// probably should be mixed-in...
Ltm.Lexicalclass.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
