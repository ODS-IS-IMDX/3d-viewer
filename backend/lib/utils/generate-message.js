// Copyright (c) 2025 NTT InfraNet
'use strict'

const generateMessage = whereTargets =>
  Object.keys(whereTargets).reduce((pre, cur) => {
    if (whereTargets[cur]) {
      return `${pre.length ? `${pre}, ` : ``}${cur}: ${whereTargets[cur]}`
    }
    return pre
  }, '')

module.exports = {
  generateMessage
}
