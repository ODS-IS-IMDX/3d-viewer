// Copyright (c) 2025 NTT InfraNet
'use strict'

const crypto = require("crypto");

module.exports.HASH_ALGORITHM = {
  MD5: 'md5'
}

module.exports.createHash = (algorithm, plainText) => {
  return crypto.createHash(algorithm).update(plainText).digest('hex')
}
