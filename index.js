'use strict'
// const d3 = require('d3')
const c3 = require('c3')
const qs = require('qs')
const axios = require('axios')

require('c3/c3.css')
// axios.get('http://project.ci:8086/query?' + qs.stringify({
//   db: 'test1',
//   q: 'SHOW MEASUREMENTS'
// })).then(resp => {
//   console.log(resp.data)
// })

const xColumns = ['x', '2017-01-01']
const chart = c3.generate({
  bindto: '#chart',
  data: {
    // xFormat: '%Y-%m-%dT%H:%M:%SZ',
    x: 'x',
    columns: [xColumns]
  },
  axis: {
    x: {
      type: 'timeseries',
      localtime: true,
      tick: {
        format: '%Y-%m-%d %H:%M:%S'
      }
    }
  }
})

axios.post('http://project.ci:8086/query', qs.stringify({
  db: 'test1',
  // q: 'SELECT * FROM "topic-offset" WHERE 1=1',
  q: 'SELECT * AS "endOffset" FROM "topic-offset" WHERE "topic" = \'sample\' AND "partition" = \'0\' AND time > now() - 1h'
})).then(resp => {
  console.log(resp.data)
})

axios.post('http://project.ci:8086/query', qs.stringify({
  db: 'test1',
  // q: 'SELECT * FROM "topic-offset" WHERE 1=1',
  q: 'SELECT mean("endOffset") AS "endOffset" FROM "topic-offset" WHERE "topic" = \'sample\' AND "partition" = \'0\' AND time > now() - 1h GROUP BY time(1m)'
})).then(resp => {
  // console.log(resp.data)
  resp.data.results.forEach(result => {
    let series = result.series[0]
    let x = series.values.map(v => new Date(v[0]))
    let columns = series.values.map(v => v && v[1])
    // console.log(series.columns)
    x.unshift(series.columns[0])
    columns.unshift(series.columns[1])

    console.log(x)
    console.log(columns)
    c3.generate({
      bindto: '#chart',
      data: {
        x: 'time',
        columns: [x, columns]
      },
      axis: {x: {
        type: 'timeseries',
        localtime: true
      }}
    })
    // chart.load({
    //   columns: [columns]
    // })
  })
  //resp.data
  // c3.generate({
  //   bindto: '#chart',
  //   data: {
  //     x: 'x',
  //     columns: [
  //       ['data1', 30, 200, 100, 400, 150, 250],
  //       ['data2', 50, 20, 10, 40, 15, 25]
  //     ]
  //   },
  //   axis: {
  //     x: {
  //       type: 'timeseries',
  //       // if true, treat x value as localtime (Default)
  //       // if false, convert to UTC internally
  //       // localtime: false,
  //       tick: {
  //         format: '%Y-%m-%d %H:%M:%S'
  //       }
  //     }
  //   }
  // })

})
// fetch('http://')

