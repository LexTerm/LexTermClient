/*global Ember*/
Ltm.Lexeme = DS.Model.extend({
    lexId: DS.attr('string'),
    lexClass: DS.belongsTo('lexicalclass'),
    concept: DS.belongsTo('concept'),
    notes: DS.hasMany('note'),
    forms: DS.hasMany('form')
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

// delete below here if you do not want fixtures
Ltm.Lexeme.FIXTURES = [

  {
    id: 0,

    lex_id: 'foo'

  },

  {
    id: 1,

    lex_id: 'foo'

  }

];
