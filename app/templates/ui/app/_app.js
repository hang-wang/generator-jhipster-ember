import Resolver from 'ember/resolver';

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.Application.initializer({
    name: 'authentication',
    initialize: function (container, application) {
        var options = {
            routeAfterInvalidation: "/login"
        };

        Ember.SimpleAuth.Session.reopen({
            currentUser: function() {
                var id = this.get('id');

                if (!Ember.isEmpty(id)) {
                    return container.lookup('store:main').find('user', id);
                }
            }.property('id')
        });

        container.register('authenticators:custom', App.CustomAuthenticator);

        Ember.SimpleAuth.setup(container, application, options);
    }
});

var App = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  // LOG_TRANSITIONS: true,
  // LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: '<%= _.underscored(baseName) %>',
  Resolver: Resolver
});

App.CustomAuthenticator = Ember.SimpleAuth.Authenticators.OAuth2.extend({
    authenticate: function (credentials) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            credentials.identification = credentials.identification.trim();
            credentials.password = credentials.password.trim();

            Ember.$.ajax({
                url: ENV.api_token_endpoint,
                type: 'POST',
                headers: {"Authorization": "Basic d2ViOg=="},
                data: {
                    client_id: 'web',
                    grant_type: 'password',
                    username: credentials.identification,
                    password: credentials.password
                }
            }).then(function (response) {
                Ember.run(function () {
                    resolve({
                        id: response.id,
                        access_token: response.access_token,
                        username: response.username,
                        roles: response.roles
                    });
                });
            }, function (xhr, status, error) {
                Ember.run(function () {
                    reject(xhr.responseText);
                });
            });
        });
    }
});

export default App;
