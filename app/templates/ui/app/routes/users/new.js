var UsersNewRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').createRecord('user', {});
  }
});

export default UsersNewRoute;

