window.Vue = require('vue');
require('vue-resource');

Vue.component('scheduler', require('./Scheduler.vue'));
Vue.component('scheduler-list', require('./SchedulerList.vue'));

var app = new Vue({
    el: '#app',
});
