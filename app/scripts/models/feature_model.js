/*global Ember*/
Ltm.Feature = DS.Model.extend({
    name: DS.attr('string'),
    featurevalues: DS.hasMany('featurevalue', {async: true})
});

// probably should be mixed-in...
Ltm.Feature.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});

// delete below here if you do not want fixtures
Ltm.Feature.FIXTURES = [

  {
    id: 0,

    name: 'foo'

  },

  {
    id: 1,

    name: 'foo'

  }

];
