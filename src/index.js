'use strict'
/* global __DEBUG__ */
const Vue = require('vue').default
const VueRouter = require('vue-router').default
require('bootstrap/less/bootstrap.less')

Vue.use(VueRouter)
Vue.config.devtools = !!__DEBUG__

const Switch = require('./components/switch')
const TimeLineChart = require('pages/time-line-chart')
Vue.component('bt-switch', Switch)
Vue.component('time-line-chart', TimeLineChart)

const Home = require('pages/home')
Home.router = new VueRouter({
  routes: [{
    name: 'Home',
    path: '',
    redirect: {name: 'topic-list'}
  }, {
    name: 'topic-list',
    path: '/topics',
    component: resolve => require(['pages/topic-list'], resolve)
  }, {
    name: 'partition-list',
    path: '/partitions',
    component: resolve => require(['pages/partition-list'], resolve)
  }, {
    name: 'topic-detail',
    path: '/topics/:topic',
    component: resolve => require(['pages/topic-detail'], resolve),
    children: [{
      path: '',
      redirect: {name: 'topic-detail-configs'}
    }, {
      name: 'topic-detail-offsets',
      path: 'offsets',
      component: resolve => require(['pages/topic-detail/offsets'], resolve)
    }, {
      name: 'topic-detail-configs',
      path: 'configs',
      component: resolve => require(['pages/topic-detail/configs'], resolve)
    }, {
      name: 'topic-detail-partitions',
      path: 'partitions',
      component: resolve => require(['pages/topic-detail/partitions'], resolve)
    }, {
      name: 'topic-detail-broker-partitions',
      path: 'broker-partitions',
      component: resolve => require(['pages/topic-detail/broker-partitions'], resolve)
    }, {
      name: 'topic-detail-metrics',
      path: 'metrics',
      component: resolve => require(['pages/topic-detail/metrics'], resolve)
    }]
  }, {
    name: 'not-found',
    path: '*',
    component: resolve => require(['pages/not-found'], resolve)
  }]
})
new Vue(Home).$mount('#app')
