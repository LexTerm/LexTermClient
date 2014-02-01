/*global Ember*/
Ltm.Form = DS.Model.extend({
    name: DS.attr('string'),
    isLemma: DS.attr('boolean'),
    lexeme: DS.belongsTo('lexeme'),
    features: DS.hasMany('featurevalue'),
    representations: DS.hasMany('representation')
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

// delete below here if you do not want fixtures
Ltm.Form.FIXTURES = [

  {
    id: 0,

    name: 'foo',

    is_lemma: 'foo'

  },

  {
    id: 1,

    name: 'foo',

    is_lemma: 'foo'

  }

];
