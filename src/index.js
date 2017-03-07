'use strict'
/* global __DEBUG__ */
const Vue = require('vue').default
const VueRouter = require('vue-router').default
require('c3/c3.css')
require('bootstrap/less/bootstrap.less')

Vue.use(VueRouter)
Vue.config.devtools = !!__DEBUG__

const Home = require('pages/home')

Home.router = new VueRouter({
  routes: [{
    name: 'topic-list',
    path: '/topics',
    component: resolve => require(['pages/topic-list'], resolve)
  }, {
    name: 'topic-detail',
    path: '/topic/:topic',
    component: resolve => require(['pages/topic-detail'], resolve)
  }]
})
new Vue(Home).$mount('#app')
