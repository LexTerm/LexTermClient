Ltm.PagerComponentComponent = Ember.Component.extend({
  sizes: [
    Ember.Object.create({active: true, value: 10}),
    Ember.Object.create({active: false, value: 25}),
    Ember.Object.create({active: false, value: 50})
  ],

  firstDisabled: true,
  leftDisabled: true,
  rightDisabled: true,
  lastDisabled: true,

  pages: function() {
    var distance = 3;
    var all_pages = this.get('allPages');
    if (all_pages.length === 0) {
      return [];
    }
    var active_page = all_pages.findBy('active');
    var begin_index = active_page.get('index') - distance;

    if (begin_index > (1 - distance) ) {
      this.set('firstDisabled', false);
      this.set('leftDisabled', false);
    } else {
      this.set('firstDisabled', true);
      this.set('leftDisabled', true);
    }

    if (begin_index < 0) {
      begin_index = 0;
    }
    var end_index = active_page.get('index') + distance -1;

    if (end_index >= all_pages.length + (distance - 1)) {
      this.set('lastDisabled', true);
      this.set('rightDisabled', true);
    } else {
      this.set('lastDisabled', false);
      this.set('rightDisabled', false);
    }

    return all_pages.slice(begin_index, end_index);
  }.property('allPages'),

  actions: {
    changeLimit: function(value) {
      this.get('sizes').findBy('active').set('active', false);
      this.get('sizes').findBy('value', value).set('active', true);
      this.sendAction('setLimit', value);
    },

    changePage: function(value) {
      this.get('pages').findBy('active').set('active', false);
      this.get('pages').findBy('value', value).set('active', true);
      this.sendAction('setStart', value);
    },

    goToFirst: function() {
      if (!this.get('firstDisabled')) {
        this.sendAction('setStart', 0);
      }
    },

    goToLast: function() {
      if (!this.get('lastDisabled')) {
        var ind = this.get('allPages').get('lastObject').get('value');
        this.sendAction('setStart', ind);
      }
    },

    moveLeft: function() {
      if(!this.get('leftDisabled')) {
        var active = this.get('pages').findBy('active');
        var ind = this.get('pages').indexOf(active);
        var next = this.get('pages')[ind-1];
        this.sendAction('setStart', next.get('value'));
      }
    },

    moveRight: function() {
      if(!this.get('rightDisabled')) {
        var active = this.get('pages').findBy('active');
        var ind = this.get('pages').indexOf(active);
        var next = this.get('pages')[ind+1];
        this.sendAction('setStart', next.get('value'));
      }
    }

  }

});
