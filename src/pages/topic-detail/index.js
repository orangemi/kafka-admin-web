'use strict'
const axios = require('axios')
const template = require('./template.pug')
const topicOffset = require('./topic-offset')

module.exports = template({
  components: {
    'topic-offset': topicOffset
  },
  data: () => ({
    topic: {},
    partitions: [],
    displayPartitions: [],
    allPartition: true,

    brokers: [],
    brokerMetrics: [],
    brokerMetrics2: {},
    broker: 1,

    consumers: [],
  }),
  mounted () {
    this.fetchData()
  },
  computed: {
    filterPartitions () {
      return this.displayPartitions.filter(p => p.show).map(p => p.id)
    },
    filterConsumers () {
      return this.consumers.filter(c => c.show).map(c => c.group)
    },
    allCheckedPartitions () {
      return this.displayPartitions.filter(p => p.show).length === this.displayPartitions.length
    },
    allCheckedConsumers () {
      return this.consumers.filter(c => c.show).length === this.consumers.length
    }
  },
  methods: {
    switchAllCheckedPartitions (e) {
      let checked = e.target.checked
      this.displayPartitions.forEach(p => {
        p.show = checked
      })
    },
    switchAllCheckedConsumers (e) {
      let checked = e.target.checked
      this.consumers.forEach(c => {
        c.show = checked
      })
    },
    fetchData () {
      this.topic = {}
      this.displayPartitions = []
      let topicName = this.$route.params.topic
      axios.get('api/topics/' + topicName).then(resp => {
        this.topic = resp.data
        for (let i = 0; i < this.topic.partitions; i++) this.displayPartitions.push({id: i, show: true})
      })
      axios.get('api/topics/' + topicName + '/partitions').then(resp => {
        this.partitions = resp.data
      })

      // fetch broker info
      axios.get('api/brokers').then(resp => {
        this.brokers = resp.data
        this.fetchBrokerMetrics(this.brokers[1])
      })

      this.consumers = []
      axios.get('api/consumers2').then(resp => {
        let consumers = resp.data
        Promise.all(consumers.map(consumer => axios.get('api/consumers2/' + consumer + '/topics').then(resp => {
          if (resp.data.includes(topicName)) this.consumers.push({group: consumer, show: true})
          return resp.data
        }))).then(data => {
          console.log(data)
        })
      })
    },

    fetchBrokerMetrics (broker) {
      // let topicName = this.$route.params.topic
      axios.get('api/brokers/' + broker + '/jmx?key=kafka.*:topic=' + this.topic.name + ',*').then(resp => {
        // console.log(resp.data)
        this.brokerMetrics = []
        // this.brokerMetrics = resp.data
        for (let key in resp.data) {
          let metrics = Object.assign({}, resp.data[key])
          let tmp = key.split(':')
          metrics.from = tmp[0]
          tmp[1].split(',').forEach(pair => {
            let tmp = pair.split('=')
            metrics[tmp[0]] = tmp[1]
          })
          this.brokerMetrics.push(metrics)
        }
      })
    }
  }
})
