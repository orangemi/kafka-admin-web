'use strict'
const axios = require('axios')
const template = require('./template.pug')
module.exports = template({
  data: () => ({
    partitionFilter: 0,
    partitions: []
  }),
  mounted () {
    this.fetchData()
  },
  computed: {
    partitions_ () {
      return this.partitions
        .filter(p => this.partitionFilter ? p.id === this.partitionFilter : true)
        // .filter(m => this.metricsFilter ? new RegExp(this.metricsFilter).test(m.name) : true)
    },
    sqls () {
      let result = {}
      this.partitions.filter(p => p.showBeginOffset).forEach(p => {
        result[`Offset:${p.topic}:${p.id}-begin`] = `SELECT mean("beginOffset") FROM "topic-partition-offsets" WHERE "topic"='${p.topic}' AND "partition"='${p.id}' AND time > now() - 1h GROUP BY time(1m)`
      })
      this.partitions.filter(p => p.showEndOffset).forEach(p => {
        result[`Offset:${p.topic}:${p.id}-end`] = `SELECT mean("endOffset") FROM "topic-partition-offsets" WHERE "topic"='${p.topic}' AND "partition"='${p.id}' AND time > now() - 1h GROUP BY time(1m)`
      })
      return result
    }
  },
  methods: {
    fetchData () {
      let topic = this.$route.params.topic
      axios.get('api/topics/' + topic + '/partitions').then(resp => {
        this.partitions = resp.data.map(d => Object.assign({
          topic: topic,
          showBeginOffset: false,
          showEndOffset: false
        }, d))
      })
    }
  }
})
