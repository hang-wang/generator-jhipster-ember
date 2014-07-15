import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.ObjectController.extend(LoginControllerMixin, {
    identification: "",
    password: "",
    authenticator: "authenticator:custom"
});