// Copyright (c) 2025 NTT InfraNet
'use strict'
const vault = require('node-vault')

const awsAuth = require('./aws-auth')

const endpoint = process.env['VAULT_ADDR']

module.exports = options => {
  // for local testing where a IAM role cannot be assumed, perform vault login using a token
  if (options.token) {
    const tokenOptions = {
      apiVersion: options.apiVersion || 'v1',
      endpoint: options.endpoint || endpoint,
      token: options.token
    }
    return vault(tokenOptions)
  }

  const awsAuthOptions = {
    apiVersion: options.apiVersion || 'v1',
    endpoint: options.endpoint || endpoint,
    vaultRole: options.role
  }
  return awsAuth(awsAuthOptions)
}
