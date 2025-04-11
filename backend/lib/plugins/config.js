// Copyright (c) 2025 NTT InfraNet
'use strict'
const fastifyPlugin = require('fastify-plugin')
const { LOG_ERROR } = require('../constants')

const config = async function(fastify) {
  try {
    const cfg = await require('../../config')()
    fastify.decorate('configBase', cfg)
  } catch (e) {
    console.error(LOG_ERROR + JSON.stringify(e))
    throw e
  }
}

module.exports = fastifyPlugin(config)
