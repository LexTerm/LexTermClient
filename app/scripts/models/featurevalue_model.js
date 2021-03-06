/*global Ember*/
Ltm.Featurevalue = DS.Model.extend({
    name: DS.attr('string'),
    feature: DS.belongsTo('feature'),
    forms: DS.hasMany('form', {async: true})
});

// probably should be mixed-in...
Ltm.Featurevalue.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
