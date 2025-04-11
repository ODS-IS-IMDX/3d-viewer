// Copyright (c) 2025 NTT InfraNet
'use strict'

const { setResponseHeaders } = require('../lib/http/set-response-headers')
const getSigningKey = require('../lib/auth/get-signin-key')
const OpenAPISchema = require('../lib/plugins/openapi')

function index(fastify, options, next) {
  fastify.register(require('@fastify/middie'))
  fastify.register(require('fastify-boom'))
  fastify.register(require('@fastify/accepts'))
  fastify.register(require('../lib/plugins/config')).after(() => {
    fastify.register(
      require('@fastify/helmet'),
      process.env.EHV_IS_DOCKER_CONTAINER !== 'true'
        ? fastify.configBase.helmet.development
        : fastify.configBase.helmet.production
    )
    fastify.register(require('@fastify/routes'))
    fastify
      .register(require('@fastify/env'), {
        data: fastify.configBase,
        schema: require('../config/schema')
      })
      .after(() => {
        fastify.register(require('@fastify/cors'), {
          origin: [fastify.config.frontend.addr]
        })

        if (fastify.config.swagger.exposeRoute) {
          const openapi = new OpenAPISchema(fastify.config.swagger)
          fastify.addHook('onRoute', routeOptions => {
            openapi.addRouteSchema(routeOptions)
          })
          fastify.get('/openapi', function(request, reply) {
            return reply.send(openapi.generate())
          })
        }

        fastify.register(require('@fastify/swagger'), fastify.config.swagger)

        fastify.register(require('fastify-jwt'), {
          secret: async (req, decoded, cb) => {
            try {
              const key = await getSigningKey(req, decoded)
              cb(null, key)
            } catch (err) {
              cb(err)
            }
          },
          verify: { algorithms: ['RS256'] },
          decode: { complete: true }
        })

        fastify.register(require('./routes'))

        const dbAdapter =
          options.dbAdapter || process.env.EHV_CORE_DB_ADAPTER || 'none'

        if (dbAdapter !== 'none') {
          fastify.register(require('./db-adapter-' + dbAdapter))
        }

        fastify.decorate('platform', dbAdapter)

        // Readiness probe
        fastify.register(require('under-pressure'), {
          maxEventLoopDelay: fastify.config.monitoring.maxEventLoopDelay,
          exposeStatusRoute: true,
          message: 'Server is under pressure'
        })
      })
  })

  fastify.addHook('onSend', async (request, reply) => {
    // Set using the operationId set for each API
    const apiOperationId =
      request.routeOptions.schema && request.routeOptions.schema.operationId
    setResponseHeaders(apiOperationId, reply)
  })

  next()
}

module.exports = index
module.exports.options = {
  ajv: {
    customOptions: {
      coerceTypes: 'array'
    }
  }
}
