'use strict'
const template = require('./template.pug')
const navi = require('pages/navi')
require('./style.styl')

module.exports = template({
  components: { navi }
})
