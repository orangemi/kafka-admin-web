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
    dataSetFns: [], // [{ label:xx, data:xx}, ...],
    startTime: moment().add(-1, 'hour').toDate(),
    endTime: moment().toDate(),
    refreshTrigger: false
  },

  addChart (name, fn, options) {
    options = options || {}
    if (this.state.dataSetFns.filter(d => d.name === name).length) return
    let color = getNextColor()
    this.state.dataSetFns.push({
      name: name,
      fn: fn,
      dataSet: {
        label: name,
        data: [],
        fill: false,
        lineTension: 0,
        fillColor: color,
        borderColor: color,
        backgroundColor: color
      }
    })
  },

  deleteChart (name, options) {
    this.state.dataSetFns = this.state.dataSetFns.filter(d => d.name !== name)
    console.log(this.state.dataSetFns)
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
    return new Promise(resolve => {
      if (this.state.brokers.length) return resolve(this.state.brokers)
      console.log('GET api/brokers')
      axios.get('api/brokers').then(resp => {
        this.state.brokers = resp.data
        resolve(this.state.borkers)
      })
    })
  }
}
