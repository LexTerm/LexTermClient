var Ltm = window.Ltm = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
});

Ltm.SearchIndex = Ember.Object.extend({
  host: "localhost:9200",
  log: "trace",
  index: 'ltm-entries',
  type: 'entry',
  es: function() {
    return elasticsearch.Client({
      host: this.get('host'),
      log: this.get('log')
    });
  }.property('host', 'log'),

  search: function(body) {
    return this.get('es').search({
      index: this.get('index'),
      type: this.get('type'),
      body: body
    });
  }

});

Ltm.entries = Ltm.SearchIndex.create();


/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');
