/*global Ember*/
Ltm.Representation = DS.Model.extend({
    name: DS.attr('string', {defaultValue: '*'}),
    representationType: DS.belongsTo('representationtype'),
    lexicalForm: DS.belongsTo('lexicalform')
});

// probably should be mixed-in...
Ltm.Representation.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
