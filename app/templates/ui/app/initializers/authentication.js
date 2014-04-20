var CustomAuthenticator = Ember.SimpleAuth.Authenticators.OAuth2.extend({
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

var AuthInitializer = {
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

        container.register('authenticators:custom', CustomAuthenticator);

        Ember.SimpleAuth.setup(container, application, options);
    }
};

export default AuthInitializer;
