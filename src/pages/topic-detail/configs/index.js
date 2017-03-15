'use strict'
const axios = require('axios')
const template = require('./template.pug')

module.exports = template({
  data: () => ({
    configs: {}
  }),
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      let topicName = this.$route.params.topic
      axios.get('api/topics/' + topicName).then(resp => {
        this.configs = resp.data
      })
    }
  }
})
