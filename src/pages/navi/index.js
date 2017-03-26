'use strict'
const template = require('./template.pug')
const naviJson = require('../../../navi')
const data = require('../../data')

require('./style.styl')

module.exports = template({
  components: {
    'navi-item': require('./navi-item')
  },
  data: () => ({
    input: '',
    brokerListMetrics: naviJson.brokerListMetrics,
    state: data.state
    // brokers: data.brokers
  }),
  computed: {
    brokerDetailMetrics () {
      return this.state.brokers.map(broker => ({
        name: 'Broker ' + broker,
        children: replaceLink(naviJson.brokerDetail, 'broker', broker)
      }))
    }
  },
  mounted () {
    data.getBrokers()
  }
})

function replaceLink (list, key, value) {
  return list.map(d => {
    d = Object.assign({}, d)
    if (d.link && d.link.params) {
      d.link = Object.assign({}, d.link)
      d.link.params = Object.assign({}, d.link.params)
      d.link.params[key] = value
    }
    if (d.children) d.children = replaceLink(d.children, key, value)
    return d
  })
}

