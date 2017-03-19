'use strict'
const moment = require('moment')
const template = require('./template.pug')
const axios = require('axios')
// console.log('topic-list', template, template({}).render)
module.exports = template({
  data: () => ({
    brokers: []
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
      axios.get('api/brokers').then((resp) => {
        this.brokers = resp.data.map(broker => ({
          broker: broker,
          // jmxPort: 0,
          // timestamp: 0,
          // endpoints: null,
          // host: '',
          // port: 0,
          // version: 0
        }))

        this.brokers.forEach(broker => {
          this.refreshBrokerData(broker)
        })
      })
    },
    refreshBrokerData (broker) {
      // if (topic.partitions.length || !topic.showPartitions) return
      axios.get(`api/brokers/${broker.broker}`).then(resp => {
        Object.keys(resp.data).forEach(key => {
          this.$set(broker, key, resp.data[key])
        })
        this.$set(broker, 'jmxPort', broker.jmx_port)
        broker.timestamp = Number(broker.timestamp) // API should fixit
        this.$set(broker, 'time', moment(broker.timestamp).format('lll'))
      })
    }
  }
})
