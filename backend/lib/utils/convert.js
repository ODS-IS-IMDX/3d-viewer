// Copyright (c) 2025 NTT InfraNet
'use strict'

const convertDataToSQLParam = val => {
  if (
    val !== null &&
    typeof val === 'object' &&
    !(val instanceof Date)
  ) {
    return JSON.stringify(val)
  }
  if (typeof val === 'boolean') {
    return val ? 1 : 0
  }
  return val
}

module.exports = {
  convertDataToSQLParam
}
