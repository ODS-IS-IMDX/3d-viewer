// Copyright (c) 2025 NTT InfraNet
'use strict'

const authorize = require('../lib/auth/authorize')
const permission = require('../lib/auth/permission')

function routes(fastify, opt, next) {
  fastify.decorate('authorize', authorize(fastify))
  fastify.decorate('permission', permission(fastify))

  require('../lib/common-schema-types')(fastify)
  require('./schema')(fastify)

  fastify.register(require('./liveness/routes'), {
    prefix: '/liveness'
  })

  if (process.env.EHV_IS_DOCKER_CONTAINER !== 'true') {
    fastify.register(require('../lib/test/api-test'))
  }

  fastify.register(require('./users/routes'))

  fastify.register(require('./sites/routes'), {
    prefix: '/sites'
  })

  fastify.register(require('./assets/routes'), {
    prefix: '/sites/:siteId/assets'
  })

  fastify.register(require('./assets/routes/proceed'), {
    prefix: '/assets'
  })

  next()
}

module.exports = routes
