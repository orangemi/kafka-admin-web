'use strict'
const template = require('./template.pug')
const navi = require('pages/navi')
const chart = require('pages/chart')
require('./style.styl')

module.exports = template({
  components: { navi, chart }
})
