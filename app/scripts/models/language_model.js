/*global Ember*/
Ltm.Language = DS.Model.extend({
    langCode: DS.attr('string'),
    regionCode: DS.attr('string', {defaultValue: ''}),
    name: DS.attr('string'),
    lexicalClasses: DS.hasMany('lexicalclass', {async: true}),

    locale: function() {
        return this.get('langCode') + "_" + this.get('regionCode');
    }.property('langCode', 'regionCode')
});

// probably should be mixed-in...
Ltm.Language.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
