import Ember from 'ember';

var Router = Ember.Router.extend({
  location: <%= _.classify(baseName) %>ENV.locationType
});

Router.map(function() {
  this.route('login');
  this.route('index', {
    path: '/'
  });
  this.resource('loggers', function() {});
  this.resource('auditEvents', function() {});
  this.resource('users', function() {
    this.route('new');
    this.route('edit', {path: '/:id'});
  });
});

export default Router;