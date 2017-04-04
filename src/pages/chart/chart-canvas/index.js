'use strict'
// const c3 = require('c3')
const ChartJs = require('chart.js')
// const axios = require('axios')
// const moment = require('moment')
const template = require('./template.pug')
const data = require('../../../data')
module.exports = template({
  props: {
    height: {type: Number, default: 200},
    limit: {type: Number, default: 5}
  },
  data: () => ({
    // state: data.state,
    dataSets: data.state.dataSets
  }),
  computed: {
    startTime: () => data.state.startTime,
    endTime: () => data.state.endTime
  },
  mounted () {
    this.generateChart()
  },
  watch: {
    dataSets: {
      deep: true,
      handler () {
        this.updateDataSets()
      }
    },
    height () {
      this.generateChart()
      this.updateDataSets()
    }
  },
  methods: {
    updateDataSets () {
      this.chart.data.datasets = Object.values(this.dataSets).map(ds => {
        let data = ds.data
        let result = Object.assign({}, ds)
        result.data = data
        return result
      })
      this.chart.update()
    },
    generateChart () {
      this.chart = new ChartJs(this.$el, {
        type: 'line',
        data: {
          datasets: []
        },
        options: {
          // responsive: true,
          // maintainAspectRatio: true,
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
