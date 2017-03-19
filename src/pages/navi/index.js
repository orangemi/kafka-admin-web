'use strict'
const template = require('./template.pug')
module.exports = template({
  computed: {
    child () { return this.$route.path.split('/')[1] }
  }
})
