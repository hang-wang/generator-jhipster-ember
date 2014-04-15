var Router = Ember.Router.extend({
  rootURL: ENV.rootURL,
  location: 'history'
});

Router.map(function() {
    this.route('login', {
        path: '/login'
    });
    this.route('index', {
        path: '/'
    });
    this.resource('loggers', function() {});
    this.resource('auditEvents', function() {});
    this.resource('users', function() {
       this.route('new');
       this.route('edit', {path: '/:id'})
    });
});

export default Router;
