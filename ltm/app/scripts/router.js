Ltm.Router.map(function () {

  this.resource('concepts', function(){
    this.resource('concept', { path: '/:concept_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('features', function(){
    this.resource('feature', { path: '/:feature_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('featurevalues', function(){
    this.resource('featurevalue', { path: '/:featurevalue_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('forms', function(){
    this.resource('form', { path: '/:form_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('languages', function(){
    this.resource('language', { path: '/:language_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('lexemes', function(){
    this.resource('lexeme', { path: '/:lexeme_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('lexicalclasses', function(){
    this.resource('lexicalclass', { path: '/:lexicalclass_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('notes', function(){
    this.resource('note', { path: '/:note_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('representations', function(){
    this.resource('representation', { path: '/:representation_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('representationtypes', function(){
    this.resource('representationtype', { path: '/:representationtype_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('subjectfields', function(){
    this.resource('subjectfield', { path: '/:subjectfield_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

});
