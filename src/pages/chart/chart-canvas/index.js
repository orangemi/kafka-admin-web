'use strict'
// const c3 = require('c3')
const ChartJs = require('chart.js')
// const axios = require('axios')
// const moment = require('moment')
const template = require('./template.pug')
const data = require('../../../data')
module.exports = template({
  props: {
    height: {type: Number, default: 0},
    limit: {type: Number, default: 5}
    // topic: {type: String},
    // sqls: {type: Object, required: true, default: () => ({})},
    // startTime: {type: Date, default: () => moment().add(-1, 'hour').toDate()},
    // endTime: {type: Date, default: () => moment().toDate()},
    // intervalSeconds: {type: Number, default: 60}, // 1 minute
    // isRelative: {type: Boolean, default: true},
    // relativeSeconds: {type: Number, default: 60 * 60}, // 1 hour
    // limit: {type: Number, default: 10}
  },
  data: () => ({
    state: data.state
  }),
  computed: {
    dataSets: () => data.state.dataSets,
    startTime: () => data.state.startTime,
    endTime: () => data.state.endTime
  },
  mounted () {
    this.generateChart()
  },
  watch: {
    height () {
      this.generateChart()
    }
    // dataSets () {
    //   this.updateDataSets()
    // }
  },
  methods: {
    updateDataSets () {
      this.chart.update()
    },
    generateChart () {
      let canvas = this.$el
      this.chart = new ChartJs(this.$el, {
        type: 'line',
        data: {
          datasets: this.dataSets
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          pointDotRadius: 0,
          bezierCurve: false,

          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              time: {
                min: this.startTime,
                max: this.endTime,
                displayFormats: {
                  quarter: 'HH:mm'
                }
              }
            }]
          }
        }
      })
    }
  }
})
