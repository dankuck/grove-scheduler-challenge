window.Vue = require('vue');
require('vue-resource');

Vue.component('scheduler', require('./Scheduler.vue'));

var app = new Vue({
    el: '#app',
});
