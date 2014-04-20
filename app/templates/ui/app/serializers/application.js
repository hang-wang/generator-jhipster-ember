export default DS.RESTSerializer.extend({
  serialize: function(record, options) {
    return this._super(record, {includeId: true});
  }
});
