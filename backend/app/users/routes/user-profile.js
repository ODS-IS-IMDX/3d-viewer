// Copyright (c) 2025 NTT InfraNet
'use strict'

// const Boom = require('@hapi/boom')
const {
  getItemResponseSchema,
  getItemResponse,
  getErrorResponseSchema,
  getErrorResponseSetSchema
} = require('../../../lib/http/responses')

// const { getUuid } = require('../../../lib/utils/uuid')
const { generateBoomObj } = require('../../../lib/utils/generate-boom-obj')
const { LOG_DEBUG } = require('../../../lib/constants')

const schema = fastify => ({
  operationId: 'getUserProfile',
  description: 'Return the user profile',
  tags: ['users'],
  response: {
    200: getItemResponseSchema({
      type: 'user',
      itemSchema: {},
      examples: [
        {
          id: '00405d25-0c08-4288-92e1-438a525360c4',
          licenseType: 'PRO',
          licenseOptions: ['DAM_REPORT', 'ELMO_CAMERA'],
          userNotifications: [
            { type: 'RELEASE_NOTE', checkedAt: '2023-04-01T00:00:00.000Z' }
          ],
          language: 'ja',
          name: 'ランドログ 太郎',
          phone_number: null,
          phone_number_2: null,
          phonetic_family_name: '',
          phonetic_given_name: '',
          picture: '',
          type: 'managed',
          address: {
            address_1: '',
            address_2: '',
            city: '',
            country: '',
            state: '',
            zip_code: ''
          },
          corporation: {
            id: 'eb483d77-8e7a-44f4-abf3-f1064f65d196',
            name: 'AAAAAAAAA'
          },
          email: 'test.taro@xxx.co.jp',
          emails: [],
          family_name: 'ランドログ',
          given_name: ' 太郎',
          groups: [
            {
              corporation_id: null,
              id: 'eb483d77-8e7a-44f4-abf3-f1064f65d196',
              name: '株式会社ランドログ',
              type: 'Corporation'
            },
            {
              corporation_id: 'eb483d77-8e7a-44f4-abf3-f1064f65d196',
              id: '89afd57e-5445-4e93-9eb6-aca747f13515',
              name: 'LLViewerTestグループ',
              type: 'Group'
            }
          ],
          site: {
            id: 'eb483d77-8e7a-44f4-abf3-f1064f65d196',
            name: '現場A'
          }
        }
      ],
      additionalProperties: true,
      description: 'Returns the profile information'
    }),
    ...getErrorResponseSetSchema({
      statusCodeList: [401, 403, 404, 500, 503],
      customSchema: {
        403: getErrorResponseSchema({
          description: 'Forbidden',
          enableMessageCode: true
        })
      }
    })
  }
})

async function get(fastify) {
  fastify.get(
    '/users/profile',
    {
      schema: schema(fastify),
      preHandler: [fastify.authorize]
    },
    async request => {
      let user = request.user
      try {
        if (user.insert) {
          // new user add
          user = await fastify.dbAdapters.users.add({
            ...user.token,
            firstName: '',
            lastName: '',
            firstLogin: new Date()
          })
        } else {
          const token = user.token
          if (
            token.corporationId !== user.corporationId ||
            token.email !== user.email
          ) {
            // user update
            user = await fastify.dbAdapters.users.update(token)
          }
        }

        const site = await fastify.dbAdapters.sites.getCorporation({
          corporationId: user.corporationId
        })

        const data = {
          id: user.id,
          language: user.language,
          name: `${user.lastName || ''} ${user.firstName || ''}`.trim(),
          phone_number: user.phone,
          type: user.role,
          corporation: {
            id: user.corporationId,
            name: user.corporationName
          },
          email: user.email,
          family_name: user.lastName,
          given_name: user.firstName,
          site: {
            id: site.id,
            name: site.name
          }
        }
        return getItemResponse({ type: 'user', data })
      } catch (e) {
        fastify.log.error(LOG_DEBUG + JSON.stringify(e))
        throw generateBoomObj({ errorObj: e })
      }
    }
  )
}

module.exports = get
