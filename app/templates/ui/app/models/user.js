var User = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  username: function() {
    return this.get('email');
  }.property('email'),
  password: DS.attr('string'),
  passwordConfirm: DS.attr('string'),
  groups: DS.attr('', {defaultValue: ['USER']}),
  credentialsExpired: DS.attr('boolean', {defaultValue: false}),
  enable: DS.attr('boolean', {defaultValue: true}),
  expired: DS.attr('boolean', {defaultValue: false}),
  locked: DS.attr('boolean', {defaultValue: false}),
  name: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName'),
  isAdmin: function(key, value) {
    if (arguments.length > 1) {
      if(value) {
        if(!this.get('groups').contains('ADMIN')) {
          this.get('groups').push('ADMIN');
        }
      } else {
        if(this.get('groups').contains('ADMIN')) {
          this.get('groups').removeObject('ADMIN');
        }
      }

    }

    return this.get('groups').contains('ADMIN');
  }.property('groups')
});

export default User;
