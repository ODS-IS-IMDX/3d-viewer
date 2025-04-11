// Copyright (c) 2025 NTT InfraNet
'use strict'

async function routes(fastify) {
  fastify.register(require('./list'))
  fastify.register(require('./upload'))
  fastify.register(require('./delete'))
  fastify.register(require('./create'))
  fastify.register(require('./download'))
  fastify.register(require('./update'))
}

module.exports = routes
