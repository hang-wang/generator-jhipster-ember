import DS from 'ember-data';

export default DS.Model.extend({
    principal: DS.attr('string'),
    auditEventDate: DS.attr('string'),
    auditEventType: DS.attr('string'),
    extraData: DS.attr()
});