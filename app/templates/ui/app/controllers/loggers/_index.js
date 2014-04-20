import PaginationMixin from '<%= _.underscored(baseName) %>/mixins/pagination';

var LoggersIndexController = Ember.ArrayController.extend(PaginationMixin, {
  modelType: 'logger',
  actions: {
    update: function (logger, level) {
      logger.set('level', level);
      logger.save();
    }
  }
});

export default LoggersIndexController;
