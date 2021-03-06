/*global Ember*/
Ltm.Representationtype = DS.Model.extend({
    name: DS.attr('string'),
    representations: DS.hasMany('representation', {async: true})
});

// probably should be mixed-in...
Ltm.Representationtype.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Em.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});

// delete below here if you do not want fixtures
Ltm.Representationtype.FIXTURES = [
  
  {
    id: 0,
    
    name: 'foo'
    
  },
  
  {
    id: 1,
    
    name: 'foo'
    
  }
  
];
