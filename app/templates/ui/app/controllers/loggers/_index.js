import Ember from 'ember';
import PaginationMixin from '<%= _.dasherize(baseName) %>/mixins/pagination';

export default Ember.ArrayController.extend(PaginationMixin, {
  modelType: 'logger',
  actions: {
    update: function (logger, level) {
      logger.set('level', level);
      logger.save();
    }
  }
});