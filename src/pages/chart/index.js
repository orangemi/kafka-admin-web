'use strict'
const template = require('./template.pug')
const chartCanvas = require('./chart-canvas')
require('./style.styl')

module.exports = template({
  components: { 'chart-canvas': chartCanvas },
  props: {
    visible: {type: Boolean, default: false}
  },
  data: () => ({
    height: 0,
    savedHeight: 200
  }),
  mounted () {
    this.visible_ = this.visible
  },
  methods: {
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
