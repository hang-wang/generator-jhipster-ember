import ValidationMixin from '<%= _.underscored(baseName) %>/mixins/validation';

var UsersNewController = Ember.ObjectController.extend(ValidationMixin, {
  actions: {
    create: function(model) {
      var self = this;
      model.save().then(function(model) {
        self.handleSuccess('User created successfully');
        self.transitionTo('users');
      }).catch(function(err) {
        self.handleError(err, 'Error creating user');
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

export default UsersNewController;
