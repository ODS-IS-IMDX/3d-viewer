// Copyright (c) 2025 NTT InfraNet
'use strict'

const path = require('path')

const SEQ_FORMAT_TYPE = {
  NORMAL: 'NORMAL',
  ZERO_P: 'ZERO_P',
}

const DEFAULT_ZERO_P_DIGIT = 3

const SEQ_FORMAT_INFO = {
  [SEQ_FORMAT_TYPE.NORMAL]: {
    init: () => ``,
    rePart: () => '_[1-9]+[0-9]*',
    output: seqNum => `${seqNum > 0 ? `_${seqNum}` : ``}`
  },
  [SEQ_FORMAT_TYPE.ZERO_P]: {
    init: () => `_001`,
    rePart: (digit = DEFAULT_ZERO_P_DIGIT) => `_[0-9]{${digit}}`,
    output: (seqNum, digit = DEFAULT_ZERO_P_DIGIT) => `_${(seqNum + 1).toString().padStart(digit, 0)}`
  }
}

const sortFunction = (a, b) => {
  const aTrim = a.trim()
  const bTrim = b.trim()

  if (aTrim === bTrim) {
    return 0
  }

  // ex) a_1.las < a_10.las
  const aLen = aTrim.length
  const bLen = bTrim.length
  if (aLen < bLen) {
    return -1
  } else if (aLen > bLen) {
    return 1
  }

  // ex) a_1.las < a_2.las
  const aLow = aTrim.toLowerCase()
  const bLow = bTrim.toLowerCase()
  if (aLow < bLow) {
    return -1
  } else if (aLow > bLow) {
    return 1
  }

  return 0
}

const getUniqueName = ({
  originName,
  nameList,
  seqType = SEQ_FORMAT_TYPE.NORMAL,
  seqDigit = DEFAULT_ZERO_P_DIGIT
}) => {
  const seqInfo = SEQ_FORMAT_INFO[seqType]
  const ext = path.extname(originName)
  const baseName = path.basename(originName, ext)
  const escapeBaseName = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const nameFormat = new RegExp(`^${escapeBaseName}(${seqInfo.rePart(seqDigit)})?${ext}$`)
  const targetList = Array.from(new Set(nameList.filter(n => nameFormat.test(n)))).sort(sortFunction)
  const seqVal = targetList.findIndex((name, i) => {
    return name !== `${baseName}${seqInfo.output(i, seqDigit)}${ext}`
  })
  if (!targetList.length || seqVal === 0) {
    return `${originName}${seqInfo.init()}`
  } else if (seqVal > 0) {
    return `${baseName}${seqInfo.output(seqVal, seqDigit)}${ext}`
  }
  return `${baseName}${seqInfo.output(targetList.length, seqDigit)}${ext}`
}

module.exports = {
  SEQ_FORMAT_TYPE,
  getUniqueName
}
