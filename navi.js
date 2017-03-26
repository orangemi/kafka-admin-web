module.exports = {
  brokerListMetrics: [{
    name: 'Replica Manager(Alert)',
    link: {name: 'broker-metrics', params: {part: 'replica-alert'}},
    includes: [
      'UnderReplicatedPartition',
      'OfflinePartitionsCount',
      'ActiveControllerCount',
      'PreferredReplicaImbalanceCount'
    ]
  }, {
    name: 'Relica Manager(Count Metrics)',
    link: {name: 'broker-metrics', params: {part: 'replica-count'}},
    includes: [
      'LeaderCount',
      'PartitionCount'
    ]
  }, {
    name: 'Relica Manager(Rate Metrics)',
    link: {name: 'broker-metrics', params: {part: 'replica-rate'}},
    includes: [
      'LeaderElectionRateAndTimeMs',
      'IsrShrinksPerSec',
      'IsrExpandsPerSec',
      'MaxLag'
    ]
  }, {
    name: 'Messages/Bytes IO',
    link: {name: 'broker-metrics', params: {part: 'io'}},
    includes: [
      'MessagesInPerSec',
      'BytesInPerSec',
      'BytesOutPerSec'
    ]
  }, {
    name: 'Log / Disk',
    link: {name: 'broker-metrics', params: {part: 'log'}},
    includes: [
      'LogEndOffset(Sum)',
      'LogCount(=Sum(LogEndOffset) - Sum(LogBeginOffset))',
      'Size(Sum)',
      'NumLogSegments(Sum)'
    ]
  }, {
    name: 'Disk IO',
    link: {name: 'broker-metrics', params: {part: 'disk'}},
    includes: [
      'LogFlushRateAndTimeMs'
    ]
  }, {
    name: 'Requests',
    link: {name: 'broker-metrics', params: {part: 'request'}},
    includes: ['RequestsPerSec']
  }, {
    name: 'DeplayedOperationPurgatory',
    includes: ['Produce', 'Fetch']
  }],
  brokerDetail: [{
    name: 'Topic Metrics',
    // link: {name: 'broker-topic', params: {part: 'topic-replica'}},
    children: [{
      name: 'Topic Replica',
      link: {name: 'broker-topic', params: {part: 'topic-replica'}}
    }, {
      name: 'Topic Logs',
      link: {name: 'broker-topic', params: {part: 'topic-log'}}
    }, {
      name: 'Topic Network',
      link: {name: 'broker-topic', params: {part: 'topic-network'}}
    }, {
      name: 'Topic Request',
      link: {name: 'broker-topic', params: {part: 'topic-request'}}
    }]
  }, {
    name: 'Partition Metrics',
    link: {name: 'broker-partition', params: {}}
  }],
  topiCList: [{
    name: 'Offset',
    includes: ['Begin(Sum)', 'End(Sum)']
  }, {
    name: 'PartitionCount'
  }, {
    name: 'Requests',
    includes: [
      'TotalProduceRequestsPerSec /G broker',
      'TotalFetchRequestsPerSec /G broker',
      'FailedProduceRequestsPerSec /G broker',
      'FailedFetchRequestsPerSec /G broker'
    ]
  }, {
    name: 'IO',
    includes: [
      'MessagesIn /G broker',
      'BytesIn /G broker',
      'BytesOut /G broker'
    ]
  }]
}
