'use strict'
const axios = require('axios')
const template = require('./template.pug')
module.exports = template({
  data: () => ({
    metricsFilter: '',
    brokerFilter: '',
    brokers: [],
    brokerMetrics: []
  }),
  mounted () {
    this.fetchData()
  },
  computed: {
    brokerMetrics_ () {
      return this.brokerMetrics
        .filter(m => this.brokerFilter ? m.broker === this.brokerFilter : true)
        .filter(m => this.metricsFilter ? new RegExp(this.metricsFilter, 'i').test(m.name) : true)
    },
    sqls () {
      let result = {}
      this.brokerMetrics.filter(m => m.show).forEach(m => {
        let key = 'Value'
        if (~Object.keys(m).indexOf('OneMinuteRate')) key = 'OneMinuteRate'
        result[`Broker:${m.broker}:${m.name}`] = `SELECT mean("${key}") FROM "${m.name}" WHERE "broker"='${m.broker}' AND "topic"='${m.topic}' AND time > now() - 1h GROUP BY time(1m)`
      })
      return result
    }
  },
  methods: {
    fetchData () {
      this.fetchBroker().then(() => {
        this.brokerMetrics = []
        this.brokers.forEach(broker => {
          this.fetchBrokerMetrics(broker)
        })
      })
    },
    fetchBroker () {
      return axios.get('api/brokers').then(resp => {
        this.brokers = resp.data
      })
    },
    fetchBrokerMetrics (broker) {
      let topicName = this.$route.params.topic
      axios.get('api/brokers/' + broker + '/jmx?key=kafka.*:type=*,name=*,topic=' + topicName).then(resp => {
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
          this.brokerMetrics.push(metrics)
        }
      })
    }
  }
})
