'use strict'
const template = require('./template.pug')
module.exports = template({
  name: 'navi-item',
  props: {
    name: {type: String, default: 'Unknown'},
    link: {type: [String, Object], default: () => ''},
    children: {type: Array, default: () => ([])},
    visible: {type: Boolean, default: false}
  },
  data: () => ({
    childrenVisible: false
  }),
  mounted () {
    this.childrenVisible = this.visible
  },
  methods: {
    doSomething () {
      console.log('navi ' + this.name + ' clicked')
    }
  }
})
