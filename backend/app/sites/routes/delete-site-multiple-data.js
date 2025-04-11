// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')
const isArray = require('lodash/isArray')

const {
  getErrorResponseSchema,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')
const { generateBoomObj } = require('../../../lib/utils/generate-boom-obj')
const {
  NOTIFICATION_MESSAGES: { SITE_MULTIPLE_DATA_DELETE_SUCCESS },
  ERROR_MESSAGES: { SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT }
} = require('../../../lib/utils/message-codes')

const { SITE_CATEGORY, LOG_DEBUG } = require('../../../lib/constants')
const { getRequestSiteSchema } = require('../schema')

const schema = fastify => ({
  operationId: 'deleteSiteMultipleData',
  description: 'Multiple site data deleted',
  tags: ['sites'],
  produces: ['*/*'],
  params: {
    type: 'object',
    properties: getRequestSiteSchema(fastify, {
      allowed: ['siteId']
    }),
    additionalProperties: false
  },
  body: {
    type: 'object',
    additionalProperties: false,
    properties: getRequestSiteSchema(fastify, {
      allowed: ['targetList']
    }),
    required: ['targetList']
  },
  response: {
    204: {
      description: 'Successfully deleted the site multiple data',
      type: 'null'
    },
    ...getErrorResponseSetSchema({
      statusCodeList: [400, 401, 403, 404, 500, 503],
      customSchema: {
        400: getErrorResponseSchema({
          description: 'Bad request error',
          enableMessageCode: true
        })
      }
    })
  }
})

async function deleteMultiple(fastify) {
  fastify.delete(
    '/:siteId/multiple-data',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize]
    },
    async (request, reply) => {
      try {
        const { siteId } = request.params
        const { targetList } = request.body
        const accessToken = request.userAccessToken
        const { userId } = request.user

        const SITE_CATEGORY_VALUES = Object.values(SITE_CATEGORY)
        const { enableTargetList, totalNum } = targetList.reduce(
          (pre, cur) => {
            if (SITE_CATEGORY_VALUES.includes(cur.type)) {
              pre.enableTargetList.push(cur)
              pre.totalNum += cur.ids.length
            }
            return pre
          },
          {
            enableTargetList: [],
            totalNum: 0
          }
        )

        if (enableTargetList.length === 0) {
          throw Boom.badRequest('Not a valid site data type')
        }

        if (totalNum > fastify.config.site.multipleData.deleteRequestLimit) {
          const errorRes = Boom.badRequest(
            SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT
          )
          errorRes.output.payload.messageCode = SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT
          throw errorRes
        }

        const results = await Promise.allSettled(
          enableTargetList.map(t => {
            switch (t.type) {
              case SITE_CATEGORY.ASSET:
                return fastify.dbAdapters.assets.deleteMultiple({
                  accessToken,
                  ids: t.ids,
                  siteId,
                  userId
                })
              default:
            }
          })
        )

        const { isNotification, isUpdateDataset, errors } = results.reduce(
          (pre, cur) => {
            switch (cur.status) {
              case 'fulfilled':
                if (cur.value.isNotification) {
                  pre.isNotification = true
                }
                if (cur.value.isUpdateDataset) {
                  pre.isUpdateDataset = true
                }
                if (cur.value.errors.length) {
                  pre.errors = pre.errors.concat(cur.value.errors)
                }
                break
              case 'rejected':
                pre.errors.push(cur.reason)
                break
            }
            return pre
          },
          {
            isNotification: false,
            isUpdateDataset: false,
            errors: []
          }
        )

        isNotification &&
          fastify.dbAdapters.sites
            .notification({
              code: SITE_MULTIPLE_DATA_DELETE_SUCCESS,
              siteId,
              userId
            })
            .catch(e => {
              fastify.log.error(LOG_DEBUG + JSON.stringify(e))
            })

        isUpdateDataset &&
          fastify.dbAdapters.datasets
            .rerunUpdateBySite({
              siteId,
              userId
            })
            .catch(e => {
              fastify.log.error(LOG_DEBUG + JSON.stringify(e))
            })

        if (errors.length) {
          throw errors
        }

        reply.code(204).send()
      } catch (e) {
        if (isArray(e)) {
          e.forEach(err => {
            fastify.log.error(LOG_DEBUG + JSON.stringify(err))
          })
          throw generateBoomObj({ errorObj: e[0] })
        } else {
          fastify.log.error(LOG_DEBUG + JSON.stringify(e))
          throw generateBoomObj({ errorObj: e })
        }
      }
    }
  )
}

module.exports = deleteMultiple
