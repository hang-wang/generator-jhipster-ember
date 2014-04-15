import ValidationMixin from '<%= _.underscored(baseName) %>/mixins/validation';

var UsersEditController = Ember.ObjectController.extend(ValidationMixin, {
  actions: {
    update: function(model) {
      var self = this;
      model.save().then(function(model) {
        self.handleSuccess('User updated successfully');
        self.transitionTo('users');
      }).catch(function(err) {
        self.handleError(err, 'Error updating user');
      });
    },
    cancel: function(model) {
      this.clearError();
      if(model.get('isDirty')) {
        model.rollback();
      }
      this.transitionToRoute('users');
    }
  }
});

export default UsersEditController;
