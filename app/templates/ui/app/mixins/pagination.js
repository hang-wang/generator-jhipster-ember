import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
      nextPage: function () {
          if (!this.get('isLastPage')) {
              this.goToPage(this.get('meta')['number'] + 1);
          }
      },
      previousPage: function () {
          if (!this.get('isFirstPage')) {
              this.goToPage(this.get('meta')['number'] - 1);
          }
      }
  },
  goToPage: function (pageNumber) {
    var self = this,
        modelType = this.get('modelType');
    this.get('store').find(modelType, {page: pageNumber}).then(function (model) {
      self.set('model', model);
      self.set('meta', model.meta);
    });
  },
  currentPage: function () {
    if (typeof this.get('meta') !== 'undefined') {
      return this.get('meta')['number'] + 1;
    }
  }.property('meta.number'),
  totalPages: function () {
    if (typeof this.get('meta') !== 'undefined') {
      return this.get('meta').totalPages;
    }
  }.property('meta.totalPages'),
  isFirstPage: function () {
    if (typeof this.get('meta') !== 'undefined') {
      return this.get('meta').firstPage;
    }
  }.property('meta.firstPage'),
  isLastPage: function () {
    if (typeof this.get('meta') !== 'undefined') {
      return this.get('meta').lastPage;
    }
  }.property('meta.lastPage')
});