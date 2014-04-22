Ltm.Router.map(function () {

  this.resource('collections', function(){});
  this.resource('collection', {path: 'collection/:collection_id'}, function(){
    this.resource('term', function(){});
    this.resource('lex', function(){
      this.route('entry', {path: 'language/:language_id/entries'});
    });
    this.resource('entry', {path: 'entry/:lexeme_id'}, function(){
      this.route('delete');
      this.route('language');
      this.route('lexicalclass');
      this.route('concept');
      this.route('subjectfield');
      this.route('form');
      this.route('features');
    });

    this.resource('entries', {}, function () {
      this.route('language');
      this.route('concept');
    });

    this.resource('tbx', function() {});
  });

  this.route('new-entry');

  // API routes useful as reference or for the programatically inclined
  //this.resource('api', function() {
      //this.resource('apicollections', function(){
        //this.resource('apicollection', { path: '/:collection_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('concepts', function(){
        //this.resource('concept', { path: '/:concept_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('features', function(){
        //this.resource('feature', { path: '/:feature_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('featurevalues', function(){
        //this.resource('featurevalue', { path: '/:featurevalue_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('forms', function(){
        //this.resource('form', { path: '/:form_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('languages', function(){
        //this.resource('language', { path: '/:language_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('lexemes', function(){
        //this.resource('lexeme', { path: '/:lexeme_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('lexicalforms', function(){
        //this.resource('lexicalform', { path: '/:lexicalform_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('lexicalclasses', function(){
        //this.resource('lexicalclass', { path: '/:lexicalclass_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('notes', function(){
        //this.resource('note', { path: '/:note_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('representations', function(){
        //this.resource('representation', { path: '/:representation_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('representationtypes', function(){
        //this.resource('representationtype', { path: '/:representationtype_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});

      //this.resource('subjectfields', function(){
        //this.resource('subjectfield', { path: '/:subjectfield_id' }, function(){
          //this.route('edit');
        //});
        //this.route('create');
      //});
    //});
});
