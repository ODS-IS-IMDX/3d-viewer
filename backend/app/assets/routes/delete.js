// Copyright (c) 2025 NTT InfraNet
'use strict'

const { generateBoomObj } = require('../../../lib/utils/generate-boom-obj')

const {
  getErrorResponseSchema,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')
const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'deleteSiteAsset',
  description: 'Delete assets (LAS)',
  tags: ['assets'],
  produces: ['*/*'],
  params: {
    type: 'object',
    properties: {
      siteId: fastify.getSchema('siteId'),
      assetId: fastify.getSchema('assetId')
    }
  },
  response: {
    204: {
      description: 'Successfully deleted the asset',
      type: 'null'
    },
    ...getErrorResponseSetSchema({
      statusCodeList: [400, 401, 403, 404, 500, 503],
      customSchema: {
        403: getErrorResponseSchema({
          description: 'Forbidden',
          enableMessageCode: true
        })
      }
    })
  }
})

async function deleteAsset(fastify) {
  fastify.delete(
    '/:assetId',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      const { siteId, assetId } = request.params
      const userId = request.user.id

      try {
        await fastify.dbAdapters.assets.deleteAsset(siteId, userId, assetId)

        reply.code(204).send()
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))
        throw generateBoomObj({ errorObj: e })
      }
    }
  )
}

module.exports = deleteAsset
