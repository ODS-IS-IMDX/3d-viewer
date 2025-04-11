// Copyright (c) 2025 NTT InfraNet
'use strict'

const { getErrorResponseSetSchema } = require('../../../lib/http/responses')
const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'patchAssets',
  description: 'Check the status of the asset information and proceed with the process',
  tags: ['assets'],
  response: {
    204: {
      description: 'Check asset status and proceed',
      type: 'null'
    },
    ...getErrorResponseSetSchema({
      statusCodeList: [500, 503]
    })
  }
})

async function proceed(fastify) {
  fastify.patch(
    '',
    {
      schema: schema(fastify)
    },
    async (request, reply) => {
      try {
        if (process.env.NODE_ENV !== 'test') {
          reply.code(204).send()
        }
        const errors = await fastify.dbAdapters.assets.proceed()
        if (errors && errors.length) {
          errors.forEach(e => {
            fastify.log.error(LOG_DEBUG + JSON.stringify(e.error))
          })
        }
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))
      }

      if (process.env.NODE_ENV === 'test') {
        reply.code(204).send()
      }
    }
  )
}

module.exports = proceed
