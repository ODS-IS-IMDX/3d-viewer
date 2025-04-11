// Copyright (c) 2025 NTT InfraNet
'use strict'

const { performance } = require('perf_hooks')

/**
 * Processing time log
 *
 * @class ProcessingTimeLog
 */
class ProcessingTimeLog {
  constructor () {
    this.lap = []
  }

  start (name = 'start') {
    this.lap = []
    this.record(name)
  }

  record (name) {
    const now = performance.now()
    const pre = this.lap.length > 0 ? this.lap[this.lap.length - 1].timestamp : now
    this.lap.push({
      name,
      timestamp: now,
      duration: now - pre
    })
  }

  display () {
    let result = {
      total: 0,
      duration: {}
    }
    if (this.lap.length > 0) {
      const total = this.lap[this.lap.length - 1].timestamp - this.lap[0].timestamp
      result = this.lap.reduce((pre, cur, i) => {
        i > 0 && (
          pre.duration[`[${i}] ${this.lap[i-1].name} -> ${cur.name}`] = cur.duration
        )
        return pre
      }, { total, duration: {} })
    }
    return result
  }
}

module.exports = ProcessingTimeLog
