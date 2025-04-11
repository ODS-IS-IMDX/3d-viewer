// Copyright (c) 2025 NTT InfraNet
'use strict'

async function routes(fastify) {
  fastify.register(require('./get'))
  fastify.register(require('./update'))
  fastify.register(require('./delete-site-multiple-data'))
}

module.exports = routes
