// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')
const { jwtDecode } = require('jwt-decode')

const { HEADER_KEY, REQUIRED_ISS, PAYLOAD_CORP } = require('./constant')

module.exports = fastify =>
  async function(req, res) {
    const auth = req.headers[HEADER_KEY] || process.env.LOCAL_TOKEN
    if (!auth) {
      throw Boom.unauthorized('Login required')
    }

    req.userAccessToken = auth

    try {
      const payload = jwtDecode(auth)

      if (!payload.iss?.startsWith(REQUIRED_ISS)) {
        throw new Error('Invalid token')
      }
      if (!payload.exp || new Date(payload.exp * 1000) < new Date()) {
        throw new Error('Token expired')
      }

      const token = {
        id: payload.sub,
        loginUserId: payload.sub,
        corporationId: payload[PAYLOAD_CORP],
        email: payload.email
      }
      const user = await fastify.dbAdapters.users
        .get({ id: token.id })
        .catch(() => ({ ...token, insert: true }))

      req.user = { ...user, token }
    } catch (e) {
      throw Boom.unauthorized(e.message)
    }
  }
