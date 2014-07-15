import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    currentUser: function() {
        var id = this.get('session.id');

        if (!Ember.isEmpty(id)) {
            return this.get('store').find('user', id);
        }
    }.property('session.id'),

    actions: {
        sessionAuthenticationSucceeded: function () {
            var self = this;

            this.get('currentUser').then(function () {
                self.transitionTo('/');
            });
        },
        sessionAuthenticationFailed: function () {
            Bootstrap.NM.push('Invalid username or password.', 'danger');
            this.transitionTo('/login');
        }
    }
});