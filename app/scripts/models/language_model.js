/*global Ember*/
Ltm.Language = DS.Model.extend({
    langCode: DS.attr('string'),
    regionCode: DS.attr('string'),
    name: DS.attr('string'),
    lexicalClasses: DS.hasMany('lexicalclass'),

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

// delete below here if you do not want fixtures
Ltm.Language.FIXTURES = [

  {
    id: 0,

    lang_code: 'foo',

    name: 'foo',

    lexical_classes: 'foo'

  },

  {
    id: 1,

    lang_code: 'foo',

    name: 'foo',

    lexical_classes: 'foo'

  }

];
