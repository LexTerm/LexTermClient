Ltm.EntryRoute = Ember.Route.extend({
    model: function(params) {
        return this.get('store').find('lexeme', params.id);
    },

    renderTemplate: function() {
        this.render();
        this.render('header', {outlet: 'header'});
    }

});
