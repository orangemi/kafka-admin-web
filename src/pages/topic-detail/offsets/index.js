'use strict'
const axios = require('axios')
const template = require('./template.pug')
const timeLineChart = require('pages/time-line-chart')

require('./style.styl')

module.exports = template({
  components: {
    'time-line-chart': timeLineChart
  },
  data: () => ({
    partitions: [],
    consumers: []
  }),
  computed: {
    sqls () {
      let topic = this.$route.params.topic
      let result = {}
      let limit = 5
      this.partitions.filter((p, i) => p.show && i < limit).forEach(p => {
        result[`TP:${topic}-${p.id}-end`] = `SELECT mean("endOffset") FROM "topic-offsets" WHERE "topic" = '${topic}' AND "partition" = '${p.id}' AND time > now() - 1h GROUP BY time(1m)`
      })
      this.consumers.filter((c, i) => c.show && i < limit).forEach(c => {
        result[`C:${c.consumer}-${c.partition}`] = `SELECT mean("offset") FROM "consumer-offsets" WHERE "group"='${c.consumer}' AND "topic" = '${topic}' AND "partition" = '${c.partition}' AND time > now() - 1h GROUP BY time(1m)`
      })
      return result
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.partitions = []
      this.consumers = []
      let topicName = this.$route.params.topic
      axios.get('api/topics/' + topicName + '/partitions').then(resp => {
        this.partitions = resp.data.map(d => Object.assign({show: true}, d))
      })
      axios.get('api/consumers2').then(resp => {
        resp.data.map(consumer => {
          axios.get('api/consumers2/' + consumer).then(resp => {
            let offsets = resp.data
            let consumers = Object
              .keys(offsets)
              .filter(tp => tp.replace(/-\d+$/, '') === topicName)
              .map(tp => ({
                consumer: consumer,
                topic: tp.replace(/-\d+$/, ''),
                partition: Number(tp.replace(/^.*-/, '')),
                offset: offsets[tp],
                expireTime: new Date(), // TODO
                commitTime: new Date(), // TODO
                show: true
              }))
            consumers.forEach(consumer => this.consumers.push(consumer))
          })
        })
      })
    }
  }
})
