Ltm.TbxController = Ember.Controller.extend({
  uploadMessage: "Upload TBX",

  collection: function() {
    return this.get('model');
  }.property('model'),

  uploadUrl: function() {
    //TODO update this to use some settings
    return 'http://localhost:8000/api/tbx/import/';
  }.property(),

  changeUploadMessage: function(message) {
    this.set('uploadMessage', message);
  },

  redirectToTerminology: function() {
    Ember.run.later(this, function() {
      this.transitionToRoute('term');
    }, 1300);
  }

});
