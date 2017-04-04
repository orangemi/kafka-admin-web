'use strict'
// const Vue = require('vue').default
const axios = require('axios')
const Vue = require('vue').default
const moment = require('moment')
const colors = ['#0275d8', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f']
let currentColorIndex = 0

function getNextColor () {
  if (currentColorIndex >= colors.length) currentColorIndex = 0
  return colors[currentColorIndex++]
}
module.exports = {
  state: {
    brokers: [],
    dataSets: {}, // [{ label:xx, data:xx}, ...],
    startTime: moment().add(-1, 'hour').toDate(),
    endTime: moment().toDate()
  },

  deleteChart (name, options) {
    let chart = this.getChart(name, {create: false})
    if (chart && chart.switcher) {
      chart.switcher.show = false
    }
    Vue.delete(this.state.dataSets, name)
  },
  getChart (name, options) {
    options = options || {}
    let chart = this.state.dataSets[name]
    if (chart) return chart
    if (options.create !== false) {
      let color = getNextColor()
      let chart = {
        label: name,
        data: [],
        fill: false,
        lineTension: 0,
        fillColor: color,
        borderColor: color,
        backgroundColor: color
      }
      if (options.switcher) {
        chart.switcher = options.switcher
      }
      Vue.set(this.state.dataSets, name, chart)
      return chart
    }
  },

  getBrokers () {
    if (this.state.brokers.length) return new Promise(resolve => {
      console.log('get brokers here', this.state.brokers)
      resolve(this.state.brokers)
    })
    return new Promise(resolve => {
      console.log('GET api/brokers')
      axios.get('api/brokers').then(resp => {
        // console.log(this.state.brokers, this)
        // Vue.set(this, 'brokers', resp.data)
        // console.log(this.state.brokers, this)
        this.state.brokers = resp.data
        resolve(this.state.borkers)
      })
    })
  }
}
