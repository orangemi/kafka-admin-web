'use strict'
const c3 = require('c3')
const qs = require('qs')
const axios = require('axios')
const template = require('./template.pug')
module.exports = template({
  props: {
    topic: {type: String},
    partitions: {type: Array, required: true, default: () => ([0])},
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
    }
  },
  methods: {
    fetchData () {
      let query = this.partitions.filter((_, i)=> i < this.limit).map(partition => `SELECT mean("endOffset") AS "endOffset" FROM "topic-offset" WHERE "topic" = '${this.topic}' AND "partition" = '${partition}' AND time > now() - 1h GROUP BY time(1m)`).join(';')
      axios.post('/influxdb/query', qs.stringify({
        db: 'test1',
        q: query
      })).then(resp => {
        console.log(resp.data)
        let charts = []
        let xInserted = false

        resp.data.results.forEach((result, i) => {
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
        this.generateChart(charts)
      })
    },
    generateChart (columns) {
      c3.generate({
        bindto: '#chart',
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
