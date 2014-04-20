var ValidationMixin = Ember.Mixin.create({
  needs: ['application'],
  clearError: function() {
    this.set('controllers.application.error', '');
  },
  handleSuccess: function(message) {
    Bootstrap.NM.push(message, 'success');
    this.clearError();
  },
  handleError: function(reason, mainMessage) {
    var error = JSON.parse(reason.responseText);
    if (!error) {
      return false;
    }

    var messageList = [];
    error.detailMessages.forEach(function(message) {
      messageList.push('<li>' + message + '</li>');
    });
    this.set('controllers.application.error', new Handlebars.SafeString(mainMessage + "<ul>" + messageList.join('') + "</ul>"));
  }
});

export default ValidationMixin;
