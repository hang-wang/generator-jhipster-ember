import PaginationMixin from 'jhipster_ember/mixins/pagination';

var AuditEventsIndexController = Ember.ArrayController.extend(PaginationMixin, {
    modelType: 'auditEvent'
});

export default AuditEventsIndexController;
