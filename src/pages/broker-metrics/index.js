'use strict'
const axios = require('axios')
const template = require('./template.pug')
const data = require('../../data')
module.exports = template({
  name: 'broker-metrics',
  data: () => ({
    state: data.state,
    brokers: {},
    brokerPartitions: []
  }),
  computed: {
    part () {
      return this.$route.params.part
    }
  },
  mounted () {
    this.fetchData()
  },
  filters: {
    value (value, key) {
      key = key || 'Value'
      if (!value) return null
      return value[key]
    },
    number (number) {
      if (typeof number === 'undefined' || number === null) return ''
      number = Number(number).toFixed(2)
      if (number === 'NaN') return number
      let tmp = number.split('.')
      let g = tmp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(',')
      let units = ['', 'K', 'M', 'G', 'T']
      number = g[0]
      if (g[1]) number += '.' + g[1].substring(0, 2) + units[g.length - 1]
      if (g.length === 1 && tmp[1] !== '00') {
        number += '.' + tmp[1]
      }
      return number
    }
  },
  methods: {
    toggleChart (broker, table, field) {
      let chartName = `brokers-${broker}-${table}-${field}`
      let switcher = this.brokers[broker][table][field]
      switcher.show = !switcher.show
      if (!switcher.show) {
        data.deleteChart(chartName)
        return
      }

      let chart = data.getChart(chartName, {switcher: switcher})
      switcher.color = chart.fillColor

      axios.post('api/influxdb/query', {
        q: `SELECT Mean("${field}") FROM "${table}" WHERE "broker"='${broker}' AND "topic"='' AND time > now() - 1h GROUP BY time(5m)`
      }).then(resp => {
        if (!resp.data || !resp.data[0] || !resp.data[0].series || !resp.data[0].series[0]) throw new Error('influxdb response error')
        let series = resp.data[0].series[0]
        chart.data = series.values.map(v => ({x: new Date(v[0]), y: v[1]}))
      })
    },
    fetchData () {
      data.getBrokers().then(brokers => {
        brokers.forEach(brokerId => {
          this.$set(this.brokers, brokerId, {
            broker: brokerId
          })
        })
        this.brokerPartitions = brokers.map(brokerId => ({
          broker: brokerId
        }))
      }).then(() => {
        this.getBrokerMetrics()
        this.getBrokerPartitionMetrics()
        this.getBrokerNetworkMetrics()
      })
    },
    getBrokerMetrics () {
      return Object.values(this.brokers).map(broker => axios.get('api/brokers/' + broker.broker + '/jmx?key=kafka.*:type=*,name=*').then(resp => {
        Object.keys(resp.data).forEach(key => {
          let name = key.split(':')[1].split(',').filter(t => /^name=/.test(t))[0].replace(/^name=/, '')
          let value = resp.data[key]
          if (typeof value.MeanRate !== 'undefined') {
            Object.keys(value).forEach(key2 => {
              value[key2] = {
                show: false,
                Value: value[key2]
              }
            })
          } else if (typeof value.Value !== 'undefined') {
            value.show = false
          }
          this.$set(broker, name, value)
        })
      }))
    },
    getBrokerPartitionMetrics () {
      return Object.values(this.brokers).map(broker => axios.get('api/brokers/' + broker.broker + '/jmx?key=kafka.*:type=*,name=*,partition=*,topic=*').then(resp => {
        let nameValues = {}
        Object.keys(resp.data).forEach(key => {
          let name = key.split(':')[1].split(',').filter(t => /^name=/.test(t))[0].replace(/^name=/, '')
          nameValues[name] = nameValues[name] || { show: false, Value: 0 }
          nameValues[name].Value += resp.data[key].Value
        })
        Object.keys(nameValues).forEach(name => {
          this.$set(broker, name, nameValues[name])
        })
      }))
    },
    getBrokerNetworkMetrics () {
      return Object.values(this.brokers).map(broker => axios.get('api/brokers/' + broker.broker + '/jmx?key=kafka.*:type=*,name=RequestsPerSec,request=*').then(resp => {
        let totalRequestsPerSec = {
          MeanRate: { Value: 0, show: false },
          OneMinuteRate: { Value: 0, show: false },
          FiveMinuteRate: { Value: 0, show: false },
          FifteenMinuteRate: { Value: 0, show: false }
        }
        this.$set(broker, 'totalRequestsPerSec', totalRequestsPerSec)

        Object.keys(resp.data).forEach(key => {
          totalRequestsPerSec.MeanRate.Value += resp.data[key].MeanRate
          totalRequestsPerSec.OneMinuteRate.Value += resp.data[key].OneMinuteRate
          totalRequestsPerSec.FiveMinuteRate.Value += resp.data[key].FiveMinuteRate
          totalRequestsPerSec.FifteenMinuteRate.Value += resp.data[key].FifteenMinuteRate
        })
      }))
    }

  }
})
