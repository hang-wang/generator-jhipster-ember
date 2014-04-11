var AuditEvent = DS.Model.extend({
    principal: DS.attr('string'),
    auditEventDate: DS.attr('string'),
    auditEventType: DS.attr('string'),
    data: DS.attr()
});

export default AuditEvent;
