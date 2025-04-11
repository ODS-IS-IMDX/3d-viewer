// Copyright (c) 2025 NTT InfraNet
'use strict'

const crypto = require('crypto')

const ALGORITHM = 'aes-256-ctr'
const IV_LENGTH = 16
const ENCODING = 'utf8'

// key: crypto.randomBytes(32).toString('base64')

const encrypt = ({
  key,
  plain
}) => {
  const keyBuf = Buffer.from(key, 'base64')
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuf, iv)
  return Buffer.concat([iv, cipher.update(plain, ENCODING), cipher.final()]).toString('hex')
}

const decrypt = ({
  key,
  encryptedHex
}) => {
  const keyBuf = Buffer.from(key, 'base64')
  const encryptedData = Buffer.from(encryptedHex, 'hex')
  const iv = encryptedData.slice(0, IV_LENGTH)
  const encrypted = encryptedData.slice(IV_LENGTH)
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuf, iv)
  const decryptedData =  Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decryptedData.toString(ENCODING)
}

module.exports = {
  encrypt,
  decrypt
}
