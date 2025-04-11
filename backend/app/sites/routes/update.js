// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')

const {
  getItemResponseSchema,
  getItemResponse,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')

const { getRequestSiteSchema, getResponseSiteSchema } = require('../schema')

const {
  NOTIFICATION_MESSAGES: { SITE_UPDATE_SUCCESS }
} = require('../../../lib/utils/message-codes')
const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'putSite',
  description: 'Updates a site.',
  tags: ['sites'],
  params: {
    type: 'object',
    properties: {
      siteId: fastify.getSchema('siteId')
    }
  },
  body: {
    type: 'object',
    additionalProperties: false,
    properties: getRequestSiteSchema(fastify, {})
  },
  response: {
    200: getItemResponseSchema({
      type: 'site',
      itemSchema: getResponseSiteSchema(fastify, {
        allowed: [
          'id',
          'name',
          'attribute',
          'externalServices',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'archivedAt'
        ]
      }),
      additionalProperties: false,
      description: 'returns the site with the specified id'
    }),
    ...getErrorResponseSetSchema({
      statusCodeList: [400, 401, 403, 404, 500, 503]
    })
  }
})

async function update(fastify) {
  fastify.put(
    '/:siteId',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize, fastify.permission]
    },
    async (request, reply) => {
      const { siteId } = request.params
      const { id: userId, corporationId } = request.user

      try {
        await fastify.dbAdapters.sites.update({
          id: siteId,
          userId,
          corporationId
        })

        const site = await fastify.dbAdapters.sites.get({
          id: siteId,
          showdeleted: false
        })

        site.externalServices = []

        await fastify.dbAdapters.sites
          .notification({
            code: SITE_UPDATE_SUCCESS,
            siteId,
            userId
          })
          .catch(e => fastify.log.error(LOG_DEBUG + JSON.stringify(e)))

        return getItemResponse({ type: 'site', data: site })
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))

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
      }
    }
  )
}

module.exports = update
