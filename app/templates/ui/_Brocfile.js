/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  name: require('./package.json').name,

  getEnvJSON: require('./config/environment')
});

// Use this to add additional libraries to the generated output files.
app.import('vendor/ember-data/ember-data.js');
app.import('vendor/ember-addons.bs_for_ember/dist/js/bs-core.max.js');
app.import('vendor/ember-addons.bs_for_ember/dist/js/bs-notifications.max.js');
app.import('vendor/ember-addons.bs_for_ember/dist/js/bs-alert.max.js');
app.import('vendor/ember-addons.bs_for_ember/dist/js/bs-button.max.js');
app.import('vendor/ember-addons.bs_for_ember/dist/js/bs-modal.max.js');
app.import('vendor/ember-simple-auth/ember-simple-auth.js');
app.import('vendor/bootstrap/js/modal.js');
app.import('vendor/bootstrap/js/dropdown.js');

// If the library that you are including contains AMD or ES6 modules that
// you would like to import into your application please specify an
// object with the list of modules as keys along with the exports of each
// module as its value.
app.import('vendor/ic-ajax/dist/named-amd/main.js', {
  'ic-ajax': [
    'default',
    'defineFixture',
    'lookupFixture',
    'raw',
    'request',
  ]
});


module.exports = app.toTree();

