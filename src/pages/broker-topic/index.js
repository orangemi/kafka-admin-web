'use strict'
const axios = require('axios')
const template = require('./template.pug')
const data = require('../../data')
module.exports = template({
  name: 'broker-metrics',
  data: () => ({
    state: data.state,
    partitions: {},
    topics: {}
  }),
  mounted () {
    this.fetchData()
  },
  filters: {
    sum (list) {
      if (!Array.isArray(list)) return 0
      let result = 0
      list.forEach(s => {
        result += s
      })
      return result
    },
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
  computed: {
    broker () {
      return this.$route.params.broker
    },
    part () {
      return this.$route.params.part
    }
  },
  methods: {
    fetchData () {
      this.getTopicMetrics()
      this.getPartitionsMetrics()
      // this.getTopicNetworkMetrics()
    },
    getTopicMetrics () {
      return axios.get('api/brokers/' + this.broker + '/jmx?key=kafka.*:type=*,name=*,topic=*').then(resp => {
        Object.keys(resp.data).forEach(key => {
          let value = resp.data[key]
          let topic = key.split(':')[1].split(',').filter(t => /^topic=/.test(t))[0].replace(/^topic=/, '')
          let name = key.split(':')[1].split(',').filter(t => /^name=/.test(t))[0].replace(/^name=/, '')
          if (!this.topics[topic]) this.$set(this.topics, topic, {topic: topic})
          if (typeof value.Value !== 'undefined') {
            this.$set(this.topics[topic], name, value.Value)
          } else if (typeof value.MeanRate !== 'undefined') {
            this.$set(this.topics[topic], name + 'MeanRate', value.MeanRate)
            this.$set(this.topics[topic], name + 'OneMinuteRate', value.OneMinuteRate)
            this.$set(this.topics[topic], name + 'FiveMinuteRate', value.FiveMinuteRate)
            this.$set(this.topics[topic], name + 'FifteenMinuteRate', value.FifteenMinuteRate)
          }
        })
      })
    },
    getPartitionsMetrics () {
      return axios.get('api/brokers/' + this.broker + '/jmx?key=kafka.*:type=*,name=*,topic=*,partition=*').then(resp => {
        Object.keys(resp.data).forEach(key => {
          let topic = key.split(':')[1].split(',').filter(t => /^topic=/.test(t))[0].replace(/^topic=/, '')
          let partition = key.split(':')[1].split(',').filter(t => /^partition=/.test(t))[0].replace(/^partition=/, '')
          let name = key.split(':')[1].split(',').filter(t => /^name=/.test(t))[0].replace(/^name=/, '')
          let tp = topic + '-' + partition
          if (!this.partitions[tp]) this.$set(this.partitions, tp, {topic: topic, partition: partition})
          let value = resp.data[key].Value
          this.$set(this.partitions[tp], name, value)
        })
      })
    },
    // getBrokerNetworkMetrics () {
    //   return this.brokers.map(broker => axios.get('api/brokers/' + broker.broker + '/jmx?key=kafka.*:type=*,name=RequestsPerSec,request=*').then(resp => {
    //     let totalRequestsPerSec = {
    //       MeanRate: 0,
    //       OneMinuteRate: 0,
    //       FiveMinuteRate: 0,
    //       FifteenMinuteRate: 0
    //     }
    //     this.$set(broker, 'totalRequestsPerSec', totalRequestsPerSec)

    //     Object.keys(resp.data).forEach(key => {
    //       totalRequestsPerSec.MeanRate += resp.data[key].MeanRate
    //       totalRequestsPerSec.OneMinuteRate += resp.data[key].OneMinuteRate
    //       totalRequestsPerSec.FiveMinuteRate += resp.data[key].FiveMinuteRate
    //       totalRequestsPerSec.FifteenMinuteRate += resp.data[key].FifteenMinuteRate
    //     })
    //   }))
    // }

  }
})
