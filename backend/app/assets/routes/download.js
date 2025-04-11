// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')

const { getStreamAndHeader } = require('../../../lib/utils/aws-s3-client')
const { getErrorResponseSchema } = require('../../../lib/http/responses')
const { generateBoomObj } = require('../../../lib/utils/generate-boom-obj')
const { GenericServerError } = require('../../../lib/errors')

const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'getSiteAssetDownload',
  description:
    'Download pre-converted asset data stored in LL storage',
  tags: ['assets'],
  params: {
    type: 'object',
    properties: {
      siteId: fastify.getSchema('siteId'),
      assetId: fastify.getSchema('assetId')
    }
  },
  consumes: ['application/octet-stream', 'application/json'],
  produces: ['application/octet-stream', 'application/json'],
  response: {
    200: {
      description: 'Default name when saving a file in a browser',
      type: 'string',
      format: 'binary',
      headers: {
        type: 'object',
        properties: {
          'Content-Disposition': {
            type: 'string'
          }
        }
      }
    },
    401: getErrorResponseSchema({
      description: 'Unauthorized error',
      enableMessageCode: true
    }),
    403: getErrorResponseSchema({
      description: 'No download permissions'
    }),
    404: getErrorResponseSchema({
      description: 'Asset not found',
      enableMessageCode: true
    }),
    500: getErrorResponseSchema({
      description: 'Generic error',
      enableMessageCode: true
    }),
    503: getErrorResponseSchema({
      description: 'Service Unavailable error',
      enableMessageCode: true
    })
  }
})

async function download(fastify) {
  fastify.get(
    '/:assetId/download',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      try {
        const { siteId, assetId } = request.params

        const asset = await fastify.dbAdapters.assets.getAsset({
          id: assetId,
          siteId,
          userId: request.user.id
        })

        const assetFile = await getStreamAndHeader(fastify.config.asset.ehv, {
          key: asset.s3ObjectKey
        })

        switch (assetFile.code) {
          case 200:
            break
          case 404:
            throw Boom.notFound('Cannot find asset file')
          default:
            throw GenericServerError('Faild find asset file')
        }

        reply
          .type('application/octet-stream')
          .header(
            'Content-Disposition',
            `attachment; filename=${encodeURIComponent(asset.name)}`
          )
          .header('Access-Control-Expose-Headers', 'Content-Disposition')

        return await assetFile.fileStream.Body.transformToByteArray()
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))
        throw generateBoomObj({ errorObj: e })
      }
    }
  )
}

module.exports = download
