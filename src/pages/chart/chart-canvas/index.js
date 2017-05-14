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
    // startTime: {type: Date, default: () => moment().add(-1, 'h').toDate()},
    // endTime: {type: Date, default: () => moment().toDate()}
  },
  data: () => ({
    dataSets: data.state.dataSets
  }),
  computed: {
    startTime: () => data.state.startTime,
    endTime: () => data.state.endTime,
    refreshTrigger: () => data.state.refreshTrigger,
    dataSetFns: () => data.state.dataSetFns
  },
  mounted () {
    this.generateChart()
  },
  watch: {
    dataSetFns () {
      this.updateDataSets()
    },
    height () {
      this.generateChart()
      this.updateDataSets()
    },
    startTime () {
      this.generateChart()
      this.updateDataSets()
    },
    endTime () {
      this.generateChart()
      this.updateDataSets()
    },
    refreshTrigger () {
      this.generateChart()
      this.updateDataSets()
    }
  },
  methods: {
    updateDataSets () {
      // TODO: refreshData should trigger dataSets's functions to generate data
      this.chart.data.datasets = this.dataSetFns.map(dataSetFn => {
        let dataSet = dataSetFn.dataSet
        dataSetFn.fn(this.startTime, this.endTime, this.intervalTime).then(res => {
          dataSet.data = res
          this.chart.update()
        })
        return dataSet
      })
      this.chart.update()
    },
    generateChart () {
      if (this.chart) this.chart.destroy()
      this.chart = new ChartJs(this.$el, {
        type: 'line',
        data: {datasets: []},
        options: {
          responsive: true,
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
