'use strict'
const c3 = require('c3')
const qs = require('qs')
const axios = require('axios')
const template = require('./template.pug')
module.exports = template({
  props: {
    topic: {type: String},
    partitions: {type: Array, required: true, default: () => ([0])},
    consumers: {type: Array, required: true, default: () => ([])},
    limit: {type: Number, default: 10}
  },
  mounted () {
    // this.generateChart()
  },
  watch: {
    topic () {
      this.fetchData()
    },
    partitions () {
      this.fetchData()
    },
    consumers () {
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      Promise.all([this.fetchTopicOffset(), this.fetchConsumserOffset()]).then(result => {
        let charts = result[0]
        if (result[1] && result[1][1]) {
          charts.push(result[1][1])
        }
        this.generateChart(charts)
      })
    },
    fetchConsumserOffset () {
      let cps = []
      if (!this.consumers.length || !this.partitions.length) return cps
      this.consumers.forEach(consumer => this.partitions.forEach(partition => {
        cps.push({partition, consumer})
      }))
      let query = cps
        .filter((_, i)=> i < this.limit)
        .map(cp => `SELECT mean("offset") FROM "consumer-offsets" WHERE "group"='${cp.consumer}' AND "topic" = '${this.topic}' AND "partition" = '${cp.partition}' AND time > now() - 1h GROUP BY time(1m)`).join(';')
      return axios.post('api/influxdb/query', {
        q: query
      }).then(resp => {
        // console.log(resp.data)
        let charts = []
        let xInserted = false

        resp.data.forEach((result, i) => {
          if (!result.series) return
          let series = result.series[0]
          if (!xInserted) {
            let x = series.values.map(v => new Date(v[0]))
            x.unshift(series.columns[0])
            charts.push(x)
            xInserted = true
          }
          let columns = series.values.map(v => v && v[1])
          columns.unshift(series.columns[1] + ':' + cps[i].consumer + ':' + cps[i].partition)
          charts.push(columns)
        })

        return charts
      })
    },
    fetchTopicOffset () {
      let query = this.partitions.filter((_, i)=> i < this.limit).map(partition => `SELECT mean("endOffset") AS "endOffsets" FROM "topic-offsets" WHERE "topic" = '${this.topic}' AND "partition" = '${partition}' AND time > now() - 1h GROUP BY time(1m)`).join(';')
      return axios.post('api/influxdb/query', {
        q: query
      }).then(resp => {
        // console.log(resp.data)
        let charts = []
        let xInserted = false

        resp.data.forEach((result, i) => {
          if (!result.series) return
          let series = result.series[0]
          if (!xInserted) {
            let x = series.values.map(v => new Date(v[0]))
            x.unshift(series.columns[0])
            charts.push(x)
            xInserted = true
          }
          let columns = series.values.map(v => v && v[1])
          columns.unshift(series.columns[1] + ':' + this.partitions[i])
          charts.push(columns)
        })

        return charts
      })
    },
    generateChart (columns) {
      c3.generate({
        bindto: this.$el,
        data: {
          x: 'time',
          columns: columns
        },
        axis: {x: {
          type: 'timeseries',
          localtime: true
        }}
      })
    }
  }
})
