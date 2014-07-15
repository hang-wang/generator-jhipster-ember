import Ember from 'ember';
import PaginationMixin from '<%= _.dasherize(baseName) %>/mixins/pagination';

export default Ember.ArrayController.extend(PaginationMixin, {
    modelType: 'auditEvent'
});