import Ember from 'ember';

export default Ember.ObjectController.extend({
  error: '',

  currentUser: function() {
    var id = this.get('session.id');

    if (!Ember.isEmpty(id)) {
      return this.get('store').find('user', id);
    }
  }.property('session.id'),

  hasError: function() {
    return this.get('error').toString().length > 0;
  }.property('error'),

  hasRootRole: function () {
    var roles = this.get('session.roles');
    if (!Ember.isEmpty(roles)) {
      if (roles instanceof Array) {
        return roles.contains('ROOT');
      } else {
        return roles.split(',').contains('ROOT');
      }
    }
  }.property('session.roles'),

  hasAdminRole: function () {
    var roles = this.get('session.roles');
    if (!Ember.isEmpty(roles)) {
      if (roles instanceof Array) {
        return roles.contains('ADMIN');
      } else {
        return roles.split(',').contains('ADMIN');
      }
    }
  }.property('session.roles')
});