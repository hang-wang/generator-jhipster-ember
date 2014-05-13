import ValidationMixin from 'jhipster_ember/mixins/validation';

var UsersEditController = Ember.ObjectController.extend(ValidationMixin, {
  actions: {
    update: function(model) {
      var self = this;
      model.save().then(function() {
        self.handleSuccess('User updated successfully');
        self.transitionTo('users');
      }).catch(function(err) {
        self.handleError(err, 'Error updating user');
      });
    },
    cancel: function() {
      this.clearError();
      if(this.get('model').get('isDirty')) {
        this.get('model').rollback();
      }
      this.transitionToRoute('users');
    }
  }
});

export default UsersEditController;

