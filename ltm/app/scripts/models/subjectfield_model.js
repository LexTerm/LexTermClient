/*global Ember*/
Ltm.Subjectfield = DS.Model.extend({
    name: DS.attr('string'),
    concepts: DS.hasMany('concept')
});

// probably should be mixed-in...
Ltm.Subjectfield.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});

// delete below here if you do not want fixtures
Ltm.Subjectfield.FIXTURES = [

  {
    id: 0,

    name: 'foo'

  },

  {
    id: 1,

    name: 'foo'

  }

];
