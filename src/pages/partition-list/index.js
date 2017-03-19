'use strict'
const template = require('./template.pug')
const axios = require('axios')
// console.log('topic-list', template, template({}).render)
module.exports = template({
  data: () => ({
    topics: [],
    filterTopicName: '',
    showPartitions: true
  }),
  mounted () {
    this.refreshData()
  },
  computed: {
    topics_ () {
      return this.topics.filter(t => this.filterTopicName ? new RegExp(this.filterTopicName).test(t) : true)
    }
  },
  methods: {
    refreshData () {
      axios.get('api/topics').then((resp) => {
        this.topics = resp.data.map(topicName => ({
          topic: topicName,
          partitions: [],
          offset: 0,
          showPartitions: this.showPartitions
        }))

        if (this.showPartitions) {
          this.topics.forEach(topic => {
            this.refreshPartitionData(topic)
          })
        }
      })
    },
    showAllPartitions () {
      this.topics.forEach(topic => {
        topic.showPartitions = this.showPartitions
        this.refreshPartitionData(topic)
      })
    },
    refreshPartitionData (topic) {
      if (topic.partitions.length || !topic.showPartitions) return
      axios.get(`api/topics/${topic.topic}/partitions`).then(resp => {
        topic.partitions = resp.data
        let offset = 0
        resp.data.forEach(p => {
          offset += p.endOffset
        })
        topic.offset = offset
      })
    }
  }
})
