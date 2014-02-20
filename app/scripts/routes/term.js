Ltm.TermRoute = Ember.Route.extend({
    model: function(params) {
        return this.get('store').find('collection', params.collection_id).then(
              function(collection) {
                return {collection: collection, collection_id: collection.get('id')};
            },
              function() {
                return {collection_id: 'all'};
            });
    },

    renderTemplate: function() {
        this.render(); //term template
        this.render('header', {outlet: 'header'});
    }

});
