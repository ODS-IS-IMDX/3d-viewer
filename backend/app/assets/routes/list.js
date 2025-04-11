// Copyright (c) 2025 NTT InfraNet
'use strict'

const querystring = require('querystring')

const {
  getCollectionResponseSchema,
  generateCollectionResponse,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')
const {
  getCollectionRequestParamsSchema
} = require('../../../lib/http/requests')
const {
  getRequestAssetsSchema,
  getResponseAssetsSchema,
  exampleValues
} = require('../schema')
const { DEFAULT_PAGE_SIZE } = require('../../../lib/http/constants')
const { generateBoomObj } = require('../../../lib/utils/generate-boom-obj')

const {
  ASSET_CATEGORY,
  ASSET_FORMAT_TYPE,
  CESIUM_ION_API_TYPE_INFO,
  EHV_ASSET_TYPE,
  ASSET_STATUS
} = require('../constants')
const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'getSiteAssets',
  description: 'Get the asset list',
  tags: ['assets'],
  querystring: {
    type: 'object',
    properties: {
      ...getCollectionRequestParamsSchema({
        allowedSortValues: ['created'],
        pageSize: DEFAULT_PAGE_SIZE,
        allowed: ['offset', 'limit']
      })
    },
    additionalProperties: false
  },
  params: {
    type: 'object',
    properties: getRequestAssetsSchema(fastify, { allowed: ['siteId'] }),
    additionalProperties: false
  },
  response: {
    200: getCollectionResponseSchema({
      customProperties: {
        isAssetRegistable: {
          description: 'Can I register as an asset?',
          type: 'boolean'
        }
      },
      itemSchema: {
        type: 'object',
        properties: getResponseAssetsSchema(fastify, {
          allowed: [
            'id',
            'contentId',
            'ionAssetId',
            'name',
            'displayName',
            'isDisplay',
            'status',
            'ionPercentComplete',
            'formatType',
            'customPosition',
            'category',
            'ionAssetType',
            'ehvAssetType',
            'startDateTime',
            'endDateTime',
            'createdBy',
            'createdAt',
            'updatedAt',
            'deletedAt'
          ]
        }),
        required: [
          'id',
          'contentId',
          'ionAssetId',
          'name',
          'displayName',
          'isDisplay',
          'status',
          'ionPercentComplete',
          'formatType',
          'customPosition',
          'category',
          'ionAssetType',
          'ehvAssetType',
          'startDateTime',
          'endDateTime',
          'createdBy',
          'createdAt',
          'updatedAt',
          'deletedAt'
        ]
      },
      description: 'Returns the assets',
      examples: [
        {
          current: 'string',
          next: null,
          prev: null,
          totalItems: 1,
          limit: 20,
          offset: 0,
          totalPages: 1,
          page: 0,
          isAssetRegistable: true,
          items: [
            {
              id: 'aVicDEVSgyrb8ZLmTMdsBi',
              contentId: 'initial-data|contents1',
              ionAssetId: 2937769,
              name: 'test_asset.las',
              displayName: 'Assets uploaded from EHV',
              isDisplay: true,
              status: ASSET_STATUS.CONVERTED,
              ionPercentComplete: 100,
              formatType: ASSET_FORMAT_TYPE.LASER,
              category: ASSET_CATEGORY.TOPOGRAPHY,
              ionAssetType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
              ehvAssetType: EHV_ASSET_TYPE.EHV_TILE,
              startDateTime: '2024-01-01T00:00:00.000Z',
              endDateTime: '2024-12-31T23:59:59.000Z',
              customPosition: exampleValues.customPosition,
              createdBy: {
                firstName: 'Name 1',
                lastName: 'Last 1',
                userId: 'initial-data|test-user1',
                email: 'test-user1@dummy.local'
              },
              createdAt: '2024-12-20T01:35:19.000Z',
              updatedAt: '2024-12-20T01:36:37.000Z',
              deletedAt: null
            }
          ]
        }
      ]
    }),
    ...getErrorResponseSetSchema({
      statusCodeList: [400, 401, 403, 404, 500, 503]
    })
  }
})

async function list(fastify) {
  fastify.get(
    '',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      try {
        const {
          limit = DEFAULT_PAGE_SIZE,
          offset = 0,
          sort = 'created',
          direction = 'DESC',
          category
        } = request.query

        const queryParam = querystring.parse(request.raw.url.split('?')[1])
        const status = queryParam['status[]']

        const { siteId } = request.params
        const {
          isRegistrable: isAssetRegistable
        } = await fastify.dbAdapters.assets.checkRegistrable({ siteId })
        const { items, totalItems } = await fastify.dbAdapters.assets.list({
          siteId,
          status,
          category,
          userId: request.user.id,
          sort,
          direction,
          offset,
          limit
        })
        const href = new URL(request.raw.url, fastify.config.server.publicUrl)
          .href
        return generateCollectionResponse({
          totalItems,
          href,
          limit,
          offset,
          customProperties: {
            isAssetRegistable
          },
          items
        })
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))
        throw generateBoomObj({ errorObj: e })
      }
    }
  )
}

module.exports = list
