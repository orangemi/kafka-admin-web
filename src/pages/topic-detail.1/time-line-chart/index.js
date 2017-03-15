'use strict'
// const c3 = require('c3')
const ChartJs = require('chart.js')
const axios = require('axios')
const moment = require('moment')
const template = require('./template.pug')
module.exports = template({
  props: {
    // topic: {type: String},
    sqls: {type: Object, required: true, default: () => ({})},
    startTime: {type: Date, default: () => moment().add(-1, 'hour').toDate()},
    endTime: {type: Date, default: () => moment().toDate()},
    intervalSeconds: {type: Number, default: 60}, // 1 minute
    isRelative: {type: Boolean, default: true},
    relativeSeconds: {type: Number, default: 60 * 60}, // 1 hour
    limit: {type: Number, default: 10}
  },
  computed: {
    realStartTime () {
      if (this.isRelative) return moment().add(-1 * this.relativeSeconds, 'seconds')
      return moment(this.startTime)
    },
    realEndTime () {
      if (this.isRelative) return moment()
      return moment(this.endTime)
    }
  },
  mounted () {
    this.generateChart()
    // this.freshData()
  },
  watch: {
    sqls () {
      // console.log(this.sqls)
      // this.generateChart()
      this.freshData()
    }
  },
  methods: {
    generateTimeAxis () {
      let result = ['x']
      for (let t = moment(this.realStartTime); t.valueOf() < this.realEndTime.valueOf(); t = t.add(this.intervalSeconds, 'second')) {
        result.push(t.toDate())
      }
      console.log(result)
      return result
    },
    generateChart () {
      // let time = this.generateTimeAxis()
      // let y = time.map((_,i) => i)
      // y[0] = 'mean'
      this.chart = new ChartJs(this.$el, {
        type: 'line',
        data: {
          // datasets: [{
          //   label: 'ddd',
          //   data: [1, 2, 3]
          // }]
        },
        options: {
          responsive: true,
          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              time: {
                min: this.realStartTime.toDate(),
                max: this.realEndTime.toDate(),
                displayFormats: {
                  quarter: 'HH:mm'
                }
              }
            }]
          }
        }
      })
    },
    freshData () {
      if (!Object.keys(this.sqls).length) return
      this.chart.data.datasets = []
      let keys = Object.keys(this.sqls)
      axios.post('api/influxdb/query', {
        q: Object.values(this.sqls).join(';')
      }).then(resp => {
        // const charts = []
        resp.data.forEach((result, i) => {
          if (!result.series) return
          let series = result.series[0]
          let data = series.values.map(v => ({x: new Date(v[0]), y: v[1]}))
          let dataset = {
            label: keys[i],
            fill: false,
            data: data
          }
          this.chart.data.datasets.push(dataset)
        })

        this.chart.update()
      })
    }
  }
})
