// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')

const { getErrorResponseSchema } = require('../../../lib/http/responses')
const { LOG_INFO } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'putSiteAssetUpload',
  description: 'Upload assets to AWS-S3',
  tags: ['assets'],
  headers: {
    type: 'object',
    properties: {
      'Content-Type': {
        type: 'string'
      }
    },
    required: ['Content-Type']
  },
  params: {
    type: 'object',
    properties: {
      siteId: fastify.getSchema('siteId'),
      assetId: fastify.getSchema('assetId')
    }
  },
  response: {
    204: {
      description: 'Successfully upload the asset',
      type: 'null'
    },
    400: getErrorResponseSchema({
      description: 'Bad request error',
      enableMessageCode: true
    }),
    401: getErrorResponseSchema({
      description: 'Unauthorized error',
      enableMessageCode: true
    }),
    403: getErrorResponseSchema({
      description: 'No upload permissions'
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

async function upload(fastify) {
  fastify.addContentTypeParser(
    'application/octet-stream',
    {
      parseAs: 'buffer',
      bodyLimit: fastify.config.asset.ehv.fileUploadMaxSize
    },
    async (_request, payload) => {
      return payload
    }
  )

  fastify.put(
    '/:assetId/upload',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      const { siteId, assetId } = request.params
      const fileByteArray = request.body
      const fileLength = request.raw.headers['content-length']
      const userId = request.user.id

      try {
        await fastify.dbAdapters.assets.upload(
          siteId,
          userId,
          assetId,
          fileByteArray,
          fileLength
        )

        reply.code(204)
      } catch (e) {
        fastify.log.error(e)
        let errorRes
        if (e.isBoom) {
          errorRes = e
        } else {
          let statusCode = e.statusCode
          if (e.name === 'EntityNotFound') {
            statusCode = 404
          } else if (e.name === 'GenericServer') {
            statusCode = 500
          }
          errorRes = Boom.boomify(e, { statusCode })
        }
        throw errorRes
      } finally {
        console.log(LOG_INFO + new Date().toISOString() + ': [UPLOAD][END]')
      }
    }
  )
}

module.exports = upload
