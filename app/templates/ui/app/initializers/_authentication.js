import Ember from 'ember';
import OAuth2 from 'simple-auth-oauth2/authenticators/oauth2';

var CustomAuthenticator = OAuth2.extend({
	authenticate: function (credentials) {
		return new Ember.RSVP.Promise(function (resolve, reject) {
			credentials.identification = credentials.identification.trim();
			credentials.password = credentials.password.trim();

			Ember.$.ajax({
				url: 'oauth/token',
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
			}, function (xhr) {
				Ember.run(function () {
					reject(xhr.responseText);
				});
			});
		});
	}
});

export default {
	name: 'authentication',
  	before: 'simple-auth',
	initialize: function (container) {
		container.register('authenticator:custom', CustomAuthenticator);   
	}
};