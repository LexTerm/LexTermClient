/*global Ember*/
Ltm.Note = DS.Model.extend({
    note: DS.attr('string'),
    noteType: DS.attr('string'),
    lexeme: DS.belongsTo('lexeme')
});

// probably should be mixed-in...
Ltm.Note.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});

// delete below here if you do not want fixtures
Ltm.Note.FIXTURES = [

  {
    id: 0,

    note: 'foo',

    note_type: 'foo'

  },

  {
    id: 1,

    note: 'foo',

    note_type: 'foo'

  }

];
