'use strict'
// const Vue = require('vue').default
const axios = require('axios')
const moment = require('moment')
const colors = ['#0275d8', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f']

module.exports = {
  state: {
    brokers: [],
    dataSets: [], // [{ label:xx, data:xx}, ...],
    startTime: moment().add(-1, 'hour').toDate(),
    endTime: moment().toDate()
  },

  getBrokers () {
    if (this.state.brokers.length) return new Promise(resolve => resolve(this.state.brokers))
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
