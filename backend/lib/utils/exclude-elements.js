// Copyright (c) 2025 NTT InfraNet
'use strict'

const cloneDeep = require('lodash/cloneDeep')

const excludeElements = (obj, targetElements) => {
  const cloneObj = cloneDeep(obj)
  targetElements.forEach(key => {
    delete cloneObj[key]
  })
  return cloneObj
}

module.exports = {
  excludeElements
}
