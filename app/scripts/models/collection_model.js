/*global Ember*/
Ltm.Collection = DS.Model.extend({
    name: DS.attr('string'),
    lexemes: DS.hasMany('lexeme', {async: true})
});

// probably should be mixed-in...
Ltm.Collection.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
