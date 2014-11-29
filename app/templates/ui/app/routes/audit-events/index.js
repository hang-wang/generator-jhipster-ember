import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    setupController: function (controller) {
        this.get('store').find('auditEvent', {page: 0}).then(function (model) {
            controller.set('model', model);
            controller.set('meta', model.meta);
        });
    }
});