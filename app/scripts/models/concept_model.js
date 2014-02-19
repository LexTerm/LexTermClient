/*global Ember*/
Ltm.Concept = DS.Model.extend({
    conceptId: DS.attr('string'),
    definition: DS.attr('string'),
    subjectFields: DS.hasMany('subjectfield', {async: true}),
    lexemes: DS.hasMany('lexeme', {async: true})
});

// probably should be mixed-in...
Ltm.Concept.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});

// delete below here if you do not want fixtures
Ltm.Concept.FIXTURES = [

  {
    id: 0,

    concept_id: 'foo',

    definition: 'foo'

  },

  {
    id: 1,

    concept_id: 'foo',

    definition: 'foo'

  }

];
