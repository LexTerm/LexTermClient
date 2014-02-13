Ltm.TermRoute = Ember.Route.extend({
    model: function(params) {
        return this.get('store').find('collection', params.collection_id).then(
            function(collection) {
              return collection;
            },
            function() {
              return false;
            });
    },

    renderTemplate: function() {
        this.render(); //term template
        this.render('header', {outlet: 'header'});
        this.render('subheader', {outlet: 'subheader'});
    }

});
