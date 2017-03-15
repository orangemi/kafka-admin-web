'use strict'
const template = require('./template.pug')
const axios = require('axios')
// console.log('topic-list', template, template({}).render)
module.exports = template({
  data: () => ({
    topics: [],
    topicName: ''
  }),
  mounted () {
    this.refreshData()
  },
  computed: {
    topics_ () {
      return this.topics.filter(t => this.topicName ? new RegExp(this.topicName).test(t) : true)
    }
  },
  methods: {
    refreshData () {
      axios.get('api/topics').then((resp) => {
        this.topics = resp.data
      })
    }
  }
})
