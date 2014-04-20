import PaginationMixin from '<%= _.underscored(baseName) %>/mixins/pagination';

var AuditEventsIndexController = Ember.ArrayController.extend(PaginationMixin, {
    modelType: 'auditEvent'
});

export default AuditEventsIndexController;
