Ltm.IndexController = Ember.ArrayController.extend({
  uploadMessage: "Upload TBX",

  uploadUrl: function() {
    //TODO update this to use some settings
    return 'http://localhost:8000/api/tbx/import/';
  }.property(),

  changeUploadMessage: function(message) {
    this.set('uploadMessage', message);
  },

  redirectToTerminology: function() {
    if (this.get('collection')) {
      this.transitionToRoute('term');
    } else {
      this.transitionToRoute('term', 1);
    }
  }

});
