// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')

const {
  getItemResponseSchema,
  getItemResponse,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')
const { getItemRequestParamsSchema } = require('../../../lib/http/requests')
const { getResponseSiteSchema } = require('../schema')
const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'getSite',
  description: 'Retrieve a specific site',
  tags: ['sites'],
  params: {
    type: 'object',
    properties: {
      siteId: fastify.getSchema('siteId')
    }
  },
  querystring: {
    type: 'object',
    properties: getItemRequestParamsSchema({ allowed: ['showdeleted'] }),
    additionalProperties: false
  },
  response: {
    200: getItemResponseSchema({
      type: 'site',
      itemSchema: getResponseSiteSchema(fastify, {
        allowed: [
          'id',
          'name',
          'cesiumIonToken',
          'location',
          'attribute',
          'viewStructure',
          'externalServices',
          'createdAt',
          'updatedAt',
          'deletedAt'
        ]
      }),
      additionalProperties: false,
      description: 'returns the site with the specified id',
      required: []
    }),
    ...getErrorResponseSetSchema({
      statusCodeList: [400, 401, 403, 404, 500, 503]
    })
  }
})

async function get(fastify) {
  fastify.get(
    '/:siteId',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      const { siteId } = request.params
      const showdeleted = request.query.showdeleted
      try {
        const site = await fastify.dbAdapters.sites.get({
          id: siteId,
          showdeleted,
          viewStructure: true
        })

        site.externalServices = []

        return getItemResponse({ type: 'site', data: site })
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))
        if (e.name === 'EntityNotFound') {
          throw Boom.boomify(e, { statusCode: 404 })
        } else if (e.name === 'GenericServer') {
          throw Boom.boomify(e, { statusCode: 500 })
        }
        if (e.isBoom) {
          throw e
        } else {
          throw Boom.boomify(e, { statusCode: e.statusCode })
        }
      }
    }
  )
}

module.exports = get
