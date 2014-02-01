//Ltm.ApplicationAdapter = DS.FixtureAdapter;
Ltm.ApplicationAdapter = DS.DjangoRESTAdapter.extend({
    host: 'http://localhost:8000',
    namespace: 'api'
});
