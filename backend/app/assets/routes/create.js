// Copyright (c) 2025 NTT InfraNet
'use strict'

const {
  getItemResponse,
  getItemResponseSchema,
  getErrorResponseSchema,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')

const { getRequestAssetsSchema, getResponseAssetsSchema } = require('../schema')

const { generateBoomObj } = require('../../../lib/utils/generate-boom-obj')

const { ASSET_CATEGORY, ASSET_FORMAT_TYPE } = require('../constants')
const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'postSiteAsset',
  description: 'Create a new asset record.',
  tags: ['assets'],
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      ...getRequestAssetsSchema(fastify, {
        allowed: [
          'name',
          'displayName',
          'customPosition',
          'startDateTime',
          'endDateTime',
          'cesiumOptions',
          'isSpace'
        ]
      })
    },
    required: ['name', 'displayName', 'isSpace']
  },
  params: {
    type: 'object',
    properties: getRequestAssetsSchema(fastify, { allowed: ['siteId'] }),
    additionalProperties: false
  },
  response: {
    201: getItemResponseSchema({
      type: 'asset',
      itemSchema: getResponseAssetsSchema(fastify, {
        allowed: [
          'id',
          'name',
          'displayName',
          'status',
          'customPosition',
          'startDateTime',
          'endDateTime'
        ]
      }),
      additionalProperties: false,
      description: 'The asset created',
      examples: [
        {
          id: 'sample_asset_01',
          name: 'sample_asset_01.las',
          displayName: 'Sample Asset 01',
          status: 'CONVERTED',
          category: ASSET_CATEGORY.TOPOGRAPHY,
          formatType: ASSET_FORMAT_TYPE.LASER,
          customPosition: null,
          startDateTime: '2021-09-02T06:04:35.053Z',
          endDateTime: '2021-09-03T06:04:35.053Z'
        }
      ],
      required: [
        'id',
        'name',
        'displayName',
        'status',
        'customPosition',
        'startDateTime',
        'endDateTime'
      ]
    }),
    ...getErrorResponseSetSchema({
      statusCodeList: [400, 401, 403, 404, 409, 500, 503],
      customSchema: {
        400: getErrorResponseSchema({
          description: 'Bad request error',
          enableMessageCode: true
        }),
        409: getErrorResponseSchema({
          description: 'Conflict error',
          enableMessageCode: true
        })
      }
    })
  }
})
async function create(fastify) {
  fastify.post(
    '',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      const { siteId } = request.params
      const {
        name: originName,
        displayName,
        customPosition,
        customStyle,
        startDateTime,
        endDateTime,
        cesiumOptions,
        isSpace
      } = request.body

      const category = ASSET_CATEGORY.TOPOGRAPHY
      const formatType = ASSET_FORMAT_TYPE.LASER

      try {
        const newAsset = await fastify.dbAdapters.assets.addIncludingLinkedData(
          {
            siteId,
            originName: originName.trim(),
            displayName,
            category,
            formatType,
            customPosition,
            customStyle,
            isSpace,
            startDateTime,
            endDateTime,
            cesiumOptions,
            isAddMessageCode: true,
            userId: request.user.id
          }
        )

        reply
          .code(201)
          .header('Content-Type', 'application/json; charset=utf-8')
        return getItemResponse({
          statusCode: 201,
          type: 'asset',
          data: newAsset
        })
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))
        throw generateBoomObj({ errorObj: e })
      }
    }
  )
}

module.exports = create
