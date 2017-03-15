'use strict'
const Bar = require('vue-chartjs').Bar
module.exports = Bar.extend({
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
})
