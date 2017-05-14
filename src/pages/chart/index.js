'use strict'
const moment = require('moment')
const template = require('./template.pug')
const chartCanvas = require('./chart-canvas')
require('./style.styl')
const data = require('../../data')

module.exports = template({
  components: { 'chart-canvas': chartCanvas },
  props: {
    visible: {type: Boolean, default: false}
  },
  data: () => ({
    height: 0,
    savedHeight: 200
    // startTime: moment().add(-1, 'h').toDate(),
    // endTime: moment().toDate()
  }),
  mounted () {
    this.visible_ = this.visible
  },
  methods: {
    refreshChart () {
      data.state.startTime = moment().add(-1, 'h').toDate()
      data.state.endTime = moment().toDate()
    },
    startDrag (evt) {
      this.isDragging = true
      this.originEvt = evt
      this.originHeight = this.height
      let self = this
      let originEvt = evt
      let originHeight = self.height

      window.document.addEventListener('mousemove', mousemove)
      window.document.addEventListener('mouseup', mouseup)

      function mousemove (evt) {
        self.savedHeight = self.height = Math.max(0, originHeight + evt.clientY - originEvt.clientY)
      }
      function mouseup (evt) {
        window.document.removeEventListener('mousemove', mousemove)
        window.document.removeEventListener('mouseup', mouseup)
      }
    }
  }
})
