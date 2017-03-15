'use strict'
/* global __DEBUG__ */
const Vue = require('vue').default
const VueRouter = require('vue-router').default
require('bootstrap/less/bootstrap.less')

Vue.use(VueRouter)
Vue.config.devtools = !!__DEBUG__

const Switch = require('./components/switch')
Vue.component('bt-switch', Switch)

const Home = require('pages/home')
Home.router = new VueRouter({
  routes: [{
    name: 'topic-list',
    path: '/topics',
    component: resolve => require(['pages/topic-list'], resolve)
  }, {
    name: 'topic-detail',
    path: '/topics/:topic',
    component: resolve => require(['pages/topic-detail'], resolve),
    children: [{
      name: 'topic-detail-offsets',
      path: 'offsets',
      component: resolve => require(['pages/topic-detail/offsets'], resolve)
    }, {
      name: 'topic-detail-configs',
      path: '',
      component: resolve => require(['pages/topic-detail/configs'], resolve)
    }]
  }]
})
new Vue(Home).$mount('#app')
