'use strict'
const template = require('./template.pug')
const navi = require('pages/navi')

module.exports = template({
  components: { navi }
})
