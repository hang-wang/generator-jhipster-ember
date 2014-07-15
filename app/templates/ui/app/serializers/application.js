import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  serialize: function(record) {
    return this._super(record, {includeId: true});
  }
});

