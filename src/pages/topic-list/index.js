'use strict'
const template = require('./template.pug')
const axios = require('axios')
// console.log('topic-list', template, template({}).render)
module.exports = template({
  data: () => ({
    topics: []
  }),
  mounted () {
    this.refreshData()
  },
  methods: {
    refreshData () {
      axios.get('api/topics').then((resp) => {
        this.topics = resp.data
      })
    }
  }
})
