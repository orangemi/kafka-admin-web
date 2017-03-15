'use strict'
const template = require('./template.pug')
require('./style.styl')
module.exports = template({
  computed: {
    child () {
      return this.$route.path.split('/')[3]
    },
    topic () {
      return this.$route.params.topic
    }
  }
})
