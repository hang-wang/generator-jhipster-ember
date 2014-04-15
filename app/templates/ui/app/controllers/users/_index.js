import PaginationMixin from '<%= _.underscored(baseName) %>/mixins/pagination';

var UsersIndexController = Ember.ArrayController.extend(PaginationMixin, {
  modelType: 'user',
  actions: {
    delete: function(model) {
      var self = this;
      model.destroyRecord().then(function() {
        Bootstrap.NM.push("User deleted successfully", 'success');
        self.get('model').removeObject(model);
      });
    },
    edit: function(model) {
      this.transitionTo('users.edit', model);
    }
  }
});

export default UsersIndexController;
