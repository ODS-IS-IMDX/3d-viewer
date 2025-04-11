// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')

const {
  getItemResponse,
  getItemResponseSchema,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')

const {
  getRequestAssetsSchema,
  getResponseAssetsSchema,
  exampleValues
} = require('../schema')

const { ASSET_FORMAT_TYPE } = require('../constants')

const {
  NOTIFICATION_MESSAGES: { ASSET_UPDATE_COMPLETE }
} = require('../../../lib/utils/message-codes')
const { LOG_DEBUG } = require('../../../lib/constants')

const ALLOWED_BODY_PARAMS = [
  'displayName',
  'startDateTime',
  'endDateTime',
  'customPosition',
  'customStyle'
]

const schema = fastify => ({
  operationId: 'putSiteAsset',
  description: 'Update asset data',
  tags: ['assets'],
  body: {
    type: 'object',
    additionalProperties: false,
    properties: getRequestAssetsSchema(fastify, {
      allowed: ALLOWED_BODY_PARAMS
    })
  },
  params: {
    type: 'object',
    properties: {
      siteId: fastify.getSchema('siteId'),
      assetId: fastify.getSchema('assetId')
    }
  },
  response: {
    200: getItemResponseSchema({
      type: 'asset',
      itemSchema: getResponseAssetsSchema(fastify, {
        allowed: [
          'displayName',
          'formatType',
          'customPosition',
          'customStyle',
          'startDateTime',
          'endDateTime'
        ]
      }),
      additionalProperties: false,
      description: 'The asset updated',
      examples: [
        {
          displayName: 'Name 01',
          formatType: ASSET_FORMAT_TYPE.LASER,
          customPosition: exampleValues.customPosition,
          customStyle: null,
          startDateTime: '2021-09-02T06:04:35.053Z',
          endDateTime: '2021-09-03T06:04:35.053Z'
        }
      ],
      required: ['displayName', 'formatType', 'startDateTime', 'endDateTime']
    }),
    ...getErrorResponseSetSchema({
      statusCodeList: [400, 401, 403, 404, 500, 503]
    })
  }
})

async function update(fastify) {
  fastify.put(
    '/:assetId',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      const { siteId, assetId } = request.params
      const isNotHaveBodyParams =
        request.body &&
        !ALLOWED_BODY_PARAMS.find(
          paramKey => request.body[paramKey] !== undefined
        )
      if (isNotHaveBodyParams) {
        throw Boom.badRequest(
          `These is no allowed parameters in request body. Allowed parameters: [${ALLOWED_BODY_PARAMS}]`
        )
      }

      const {
        displayName,
        startDateTime,
        endDateTime,
        customPosition,
        customStyle
      } = request.body
      const isUpdate = true
      fastify.dbAdapters.assets.validation({
        startDateTime,
        endDateTime,
        isUpdate
      })

      const userId = request.user.id

      try {
        const [updatedAsset] = await fastify.dbAdapters.assets.updateAsset({
          id: assetId,
          siteId,
          userId,
          displayName,
          startDateTime,
          endDateTime,
          customPosition,
          customStyle,
          updatedBy: userId
        })

        await Promise.all([
          fastify.dbAdapters.assets
            .notification({
              code: ASSET_UPDATE_COMPLETE,
              assetId: updatedAsset.id,
              userId
            })
            .catch(e => {
              fastify.log.error(LOG_DEBUG + JSON.stringify(e))
            })
        ])

        reply.header('Content-Type', 'application/json; charset=utf-8')
        return getItemResponse({ type: 'asset', data: updatedAsset })
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))

        if (e.isBoom) {
          throw e
        }

        const statusCode =
          e.name === 'EntityNotFound'
            ? 404
            : e.statusCode || e.output.statusCode || 500

        throw Boom.boomify(e, { statusCode })
      }
    }
  )
}

module.exports = update
