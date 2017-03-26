'use strict'
const axios = require('axios')
const template = require('./template.pug')
const data = require('../../data')
module.exports = template({
  name: 'broker-metrics',
  data: () => ({
    state: data.state,
    brokers: [],
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
    number (number) {
      if (typeof number === 'undefined' || number === null) return ''
      number = number.toFixed(2)
      let tmp = number.split('.')
      let g = tmp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(',')
      // let d = tmp[1] || '00'
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
    showChart (borker, table, field) {
      let chartName = `broker-${broker}-${table}-${field}`
      state.dataSets[]
    },
    fetchData () {
      data.getBrokers().then(brokers => {
        this.brokers = brokers.map(brokerId => ({
          broker: brokerId
        }))
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
      return this.brokers.map(broker => axios.get('api/brokers/' + broker.broker + '/jmx?key=kafka.*:type=*,name=*').then(resp => {
        Object.keys(resp.data).forEach(key => {
          let name = key.split(':')[1].split(',').filter(t => /^name=/.test(t))[0].replace(/^name=/, '')
          let value = resp.data[key]
          if (typeof value.MeanRate !== 'undefined') {
            this.$set(broker, name, value.MeanRate)
            this.$set(broker, name + 'OneMinuteRate', value.OneMinuteRate)
            this.$set(broker, name + 'FiveMinuteRate', value.FiveMinuteRate)
            this.$set(broker, name + 'FifteenMinuteRate', value.FifteenMinuteRate)
          } else if (typeof value.Value !== 'undefined') {
            this.$set(broker, name, value.Value)
          }
        })
      }))
    },
    getBrokerPartitionMetrics () {
      return this.brokers.map(broker => axios.get('api/brokers/' + broker.broker + '/jmx?key=kafka.*:type=*,name=*,partition=*,topic=*').then(resp => {
        let nameValues = {}
        Object.keys(resp.data).forEach(key => {
          let name = key.split(':')[1].split(',').filter(t => /^name=/.test(t))[0].replace(/^name=/, '')
          nameValues[name] = nameValues[name] || 0
          nameValues[name] += resp.data[key].Value
          if (/sample/.test(key)) console.log(broker.broker, key, name, nameValues[name])
        })
        Object.keys(nameValues).forEach(name => {
          this.$set(broker, name, nameValues[name])
        })
      }))
    },
    getBrokerNetworkMetrics () {
      return this.brokers.map(broker => axios.get('api/brokers/' + broker.broker + '/jmx?key=kafka.*:type=*,name=RequestsPerSec,request=*').then(resp => {
        let totalRequestsPerSec = {
          MeanRate: 0,
          OneMinuteRate: 0,
          FiveMinuteRate: 0,
          FifteenMinuteRate: 0
        }
        this.$set(broker, 'totalRequestsPerSec', totalRequestsPerSec)

        Object.keys(resp.data).forEach(key => {
          totalRequestsPerSec.MeanRate += resp.data[key].MeanRate
          totalRequestsPerSec.OneMinuteRate += resp.data[key].OneMinuteRate
          totalRequestsPerSec.FiveMinuteRate += resp.data[key].FiveMinuteRate
          totalRequestsPerSec.FifteenMinuteRate += resp.data[key].FifteenMinuteRate
        })
      }))
    }

  }
})
