Ltm.Lexicalform = DS.Model.extend({
    isLemma: DS.attr('boolean'),
    form: DS.belongsTo('form'),
    lexeme: DS.belongsTo('lexeme'),
    representations: DS.hasMany('representation', {async: true}),

    writtenRepresentations: function() {
        var proxy = Ember.ArrayProxy.create();
        this.get('store').find('representation', {
            lexical_form: this.get('id'),
            representation_type__name: 'written'
        }).then(function(reps) {
            proxy.set('content', reps);
        });
        return proxy;
    }.property('representations.@each')
});

// probably should be mixed-in...
Ltm.Lexicalform.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Ember.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
