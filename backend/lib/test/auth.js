// Copyright (c) 2025 NTT InfraNet
'use strict'
const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')

const getToken = payload => jwt.sign(payload, 'shhhhh')

/**
 * Get a User token for testing
 *
 * @param {String} user - The user token to read from fixtures
 * @returns {Object} A signed JWT Object
 * @module lib/test/auth
 * @version 0.2 Berkeley
 * @since 0.1 Austin
 */
const getUserToken = async user => {
  const payload = JSON.parse(
    await fs.readFile(
      path.join(__dirname, '../../fixtures/users', `${user}.json`),
      'utf-8'
    )
  )
  return getToken(payload)
}

module.exports = { getToken, getUserToken }
