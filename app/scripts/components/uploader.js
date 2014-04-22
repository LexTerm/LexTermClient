Ltm.FileUploadComponent = Ember.FileField.extend({
  url: '',

  filesDidChange: (function() {
    var component = this;
    var uploadUrl = this.get('url');
    var files = this.get('files');

    var uploader = Ember.Uploader.createWithMixins({
      url: uploadUrl,
      upload: function (file) {
        var collection = component.get('collection');
        var collection_name = collection ? collection.get('name') : '';
        var data = this.setupFormData(file, {collection: collection_name});
        var url  = this.get('url');
        var type = this.get('type');
        var self = this;

        this.set('isUploading', true);

        return this.ajax(url, data, type).then(function(respData) {
          self.didUpload(respData);
          return respData;
        });
      }
    });

    if (!Ember.isEmpty(files)) {
      uploader.on('didUpload', function(e) {
        component.sendAction('redirect');
        component.sendAction('displayStatus', 'Upload TBX');
      });

      component.sendAction('displayStatus', '');
      uploader.upload(files[0]);

    }
  }).observes('files'),

});
