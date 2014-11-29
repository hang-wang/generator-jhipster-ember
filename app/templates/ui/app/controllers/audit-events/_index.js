import Ember from 'ember';
import PaginationMixin from 'ui/mixins/pagination';

export default Ember.ArrayController.extend(PaginationMixin, {
    modelType: 'auditEvent'
});