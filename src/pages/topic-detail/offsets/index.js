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
    consumers: [],
    showBegin: true,
    showEnd: true
  }),
  computed: {
    beginOffset () {
      let sum = 0
      this.partitions.forEach(p => {
        sum += p.beginOffset
      })
      return sum
    },
    endOffset () {
      let sum = 0
      this.partitions.forEach(p => {
        sum += p.endOffset
      })
      return sum
    },
    sqls () {
      let topic = this.$route.params.topic
      let result = {}
      let limit = 5

      // let w = this.partitions.filter((p, i) => p.show).map(p => `"partition" = '${p.id}'`)
      // w.unshift(`"topic" = '${topic}'`)
      // w = w.join(' AND ')
      let w = `"topic" = '${topic}'`

      if (this.showBegin) result[`Topic:${topic}-begin`] = `SELECT mean("beginOffset") FROM "topic-offsets" WHERE ${w} AND time > now() - 1h GROUP BY time(1m)`
      if (this.showEnd) result[`Topic:${topic}-end`] = `SELECT mean("endOffset") FROM "topic-offsets" WHERE ${w} AND time > now() - 1h GROUP BY time(1m)`
      // this.partitions.filter((p, i) => p.show && i < limit).forEach(p => {
      //   result[`TP:${topic}-${p.id}-end`] = `SELECT mean("endOffset") FROM "topic-offsets" WHERE "topic" = '${topic}' AND "partition" = '${p.id}' AND time > now() - 1h GROUP BY time(1m)`
      // })
      this.consumers.filter((c, i) => c.show && i < limit).forEach(c => {
        result[`Consumer:${c.consumer}`] = `SELECT mean("offset") FROM "consumer-offsets" WHERE "group"='${c.consumer}' AND ${w} AND time > now() - 1h GROUP BY time(1m)`
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
      axios.get(`api/topics/${topicName}/consumers2`).then(resp => {
        resp.data.map(consumer => {
          axios.get('api/consumers2/' + consumer).then(resp => {
            let offset = 0
            let offsets = resp.data
            Object
              .keys(offsets)
              .filter(tp => tp.replace(/-\d+$/, '') === topicName)
              .forEach(tp => {
                offset += offsets[tp]
              })
            this.consumers.push({
              consumer: consumer,
              topic: topicName,
              offset: offset,
              show: true
            })
          })
        })
      })
    }
  }
})
