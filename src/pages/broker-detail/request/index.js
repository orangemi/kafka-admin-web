'use strict'
const axios = require('axios')
const template = require('./template.pug')
module.exports = template({
  data: () => ({
    metricsFilter: '',
    requestFilter: '',
    brokers: [],
    metrics: []
  }),
  mounted () {
    this.fetchData()
  },
  computed: {
    broker () {
      return this.$route.params.broker
    },
    metrics_ () {
      return this.metrics
        .filter(m => this.requestFilter ? new RegExp(this.requestFilter, 'i').test(m.request) : true)
        .filter(m => this.metricsFilter ? new RegExp(this.metricsFilter, 'i').test(m.name) : true)
    },
    sqls () {
      let result = {}
      this.metrics.filter(m => m.show).forEach(m => {
        let key = 'Value'
        if (~Object.keys(m).indexOf('OneMinuteRate')) key = 'OneMinuteRate'
        if (~Object.keys(m).indexOf('Mean')) key = 'Mean'
        result[`${m.request}:${m.name}`] = `SELECT mean("${key}") FROM "${m.name}" WHERE "broker"='${this.broker}' AND "request"='${m.request}' AND time > now() - 1h GROUP BY time(1m)`
      })
      return result
    }
  },
  methods: {
    fetchData () {
      this.fetchBrokerMetrics(this.broker)
    },
    fetchBrokerMetrics (broker) {
      axios.get(`api/brokers/${broker}/jmx?key=kafka.*:type=*,name=*,request=*`).then(resp => {
        for (let key in resp.data) {
          let metrics = Object.assign({}, resp.data[key])
          let tmp = key.split(':')
          metrics.from = tmp[0]
          tmp[1].split(',').forEach(pair => {
            let tmp = pair.split('=')
            metrics[tmp[0]] = tmp[1]
            metrics.broker = broker
            metrics.show = false
          })
          this.metrics.push(metrics)
        }
      })
    }
  }
})
