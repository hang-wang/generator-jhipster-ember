import Ember from 'ember';
import PaginationMixin from 'ui/mixins/pagination';

export default Ember.ArrayController.extend(PaginationMixin, {
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