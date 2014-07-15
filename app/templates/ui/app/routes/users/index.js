import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  setupController: function (controller) {
    var self = this;
    this.get('store').find('user', {page: 0}).then(function (model) {
      controller.set('model', model);
      controller.set('meta', Ember.copy(self.get('store').metadataFor('user')));
    });
  }
});