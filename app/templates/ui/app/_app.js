import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: '<%= _.underscored(baseName) %>',
  Resolver: Resolver
});

loadInitializers(App, '<%= _.underscored(baseName) %>');

export default App;

