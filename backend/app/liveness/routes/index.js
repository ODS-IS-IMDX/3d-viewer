// Copyright (c) 2025 NTT InfraNet
'use strict'

async function routes(fastify) {
  fastify.register(require('./get'))
}

module.exports = routes
