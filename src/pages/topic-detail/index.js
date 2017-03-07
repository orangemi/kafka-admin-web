'use strict'
const axios = require('axios')
const template = require('./template.pug')
const topicOffset = require('./topic-offset')

module.exports = template({
  components: {
    'topic-offset': topicOffset
  },
  data: () => ({
    // topicName: '',
    topic: {},
    partitions: [],
    allPartition: true
  }),
  mounted () {
    this.fetchData()
  },
  computed: {
    filterPartitions () {
      return this.partitions.filter(p => p.show).map(p => p.id)
    },
    allChecked () {
      return this.partitions.filter(p => p.show).length === this.partitions.length
    }
  },
  methods: {
    switchAllChecked (e) {
      let checked = e.target.checked
      this.partitions.forEach(p => {
        p.show = checked
      })
    },
    fetchData () {
      let topicName = this.$route.params.topic
      axios.get('api/topics/' + topicName).then((resp) => {
        this.topic = resp.data
        this.partitions = []
        for (let i = 0; i < this.topic.partitions; i++) this.partitions.push({id: i, show: true})
        // console.log(this.partitions)
      })
    }
  }
})
