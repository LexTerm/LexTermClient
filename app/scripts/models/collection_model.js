/*global Ember*/
Ltm.Collection = DS.Model.extend({
    name: DS.attr('string'),
    //lexemes: DS.hasMany('lexeme', {async: true})
    hasLexemes: function() {
      var proxy = Ember.ObjectProxy.create({fulfilled: false});
      Ltm.entries.search().then(function(data) {
        if (data.hits.total > 0) {
          proxy.set('fulfilled', true);
        }
      });
      return proxy;
    }.property()
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
