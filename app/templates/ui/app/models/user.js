var User = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    email: DS.attr('string'),
    username: DS.attr('string'),
    email: DS.attr('string'),
    enable: DS.attr('boolean', {defaultValue: true}),
    expired: DS.attr('boolean', {defaultValue: false}),
    locked: DS.attr('boolean', {defaultValue: false}),
    name: function() {
        return this.get('firstName') + ' ' + this.get('lastName');
    }.property('firstName', 'lastName')
});

export default User;
