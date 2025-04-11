// Copyright (c) 2025 NTT InfraNet
'use strict'

async function routes(fastify) {
  fastify.register(require('./user-profile'))
}

module.exports = routes
