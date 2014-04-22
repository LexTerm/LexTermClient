Ltm.Concept = DS.Model.extend({
  conceptId: DS.attr('string'),
  definition: DS.attr('string', {defaultValue: ''}),
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
