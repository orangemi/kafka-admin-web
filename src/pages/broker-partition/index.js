'use strict'
const axios = require('axios')
const template = require('./template.pug')
const data = require('../../data')
module.exports = template({
  name: 'broker-metrics',
  data: () => ({
    state: data.state,
    partitions: {}
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
    }
  },
  methods: {
    fetchData () {
      this.getPartitionsMetrics()
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
    }
  }
})
