// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')
const buildFastify = require('../../../lib/test/build-fastify')
const { getUserToken } = require('../../../lib/test/auth')
const {
  resetDb,
  GENERAL_USER_ID,
  GENERAL_CONTENT_ID
} = require('../../../lib/test/cloud')
const { HEADER_KEY } = require('../../../lib/auth/constant')

describe('GET `/sites/:siteId/assets` Cloud', () => {
  const assertion = (config, response) => {
    const DateTypeKey = [
      'startDateTime',
      'endDateTime',
      'createdAt',
      'updatedAt',
      'deletedAt'
    ]

    for (let i = 0; i < config.expected.length; i++) {
      Object.keys(config.expected[i]).forEach(key => {
        if (DateTypeKey.includes(key) && response.body.data.items[i][key]) {
          t.deepEqual(
            response.body.data.items[i][key],
            new Date(config.expected[i][key]).toISOString()
          )
        } else {
          t.deepEqual(response.body.data.items[i][key], config.expected[i][key])
        }
      })
    }
  }

  const api = async ({
    server,
    siteId,
    accessUserId,
    queryString = null,
    statusCode
  }) => {
    const url = `/sites/${siteId}/assets?${queryString}`
    return supertest(server)
      .get(url)
      .set(
        HEADER_KEY,
        accessUserId ? await getUserToken(accessUserId) : 'xxxxxxxxxxxxxxx'
      )
      .set('Content-Type', 'application/json; charset=utf-8')
      .expect(statusCode)
      .expect('Content-Type', 'application/json; charset=utf-8')
  }

  let fastify

  before(async () => {
    fastify = buildFastify({ dbAdapter: 'cloud' })
    await fastify.ready()
  })

  beforeEach(async () => {
    await resetDb([
      'corporations',
      'users',
      'contents',
      'contents_resource_owners',
      'assets'
    ])
  })

  after(async done => {
    await fastify.close(done)
  })

  it('Normal system: Success (no paging specified)', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      expected: [
        {
          id: 'content-0000-0000-0000-general-3',
          contentId: 'content-0000-0000-0000-general',
          ionAssetId: 0,
          name: 'general content id asset3',
          displayName: 'GeneralContentId アセット3',
          isDisplay: true,
          status: 'CONVERTED',
          ionPercentComplete: 0,
          formatType: 'GEOJSON',
          customPosition: null,
          category: 'model3d',
          ionAssetType: 'GEOJSON',
          ehvAssetType: 'ehvTile',
          startDateTime: '2024-01-05T00:00:00.000',
          endDateTime: '2024-01-06T00:00:00.000',
          createdBy: {
            firstName: '共通',
            lastName: 'ユーザー',
            userId: 'user-0000-0000-0000-general',
            email: 'general-user@example.com'
          },
          createdAt: '2024-01-05T00:00:00.000',
          updatedAt: '2024-01-05T00:00:00.000',
          deletedAt: null
        },
        {
          id: 'content-0000-0000-0000-general-2',
          contentId: 'content-0000-0000-0000-general',
          ionAssetId: 0,
          name: 'general content id asset2',
          displayName: 'GeneralContentId アセット2',
          isDisplay: true,
          status: 'CONVERTED',
          ionPercentComplete: 0,
          formatType: 'GEOJSON',
          customPosition: null,
          category: 'model3d',
          ionAssetType: 'GEOJSON',
          ehvAssetType: 'ehvTile',
          startDateTime: '2024-01-03T00:00:00.000',
          endDateTime: '2024-01-04T00:00:00.000',
          createdBy: {
            firstName: '共通',
            lastName: 'ユーザー',
            userId: 'user-0000-0000-0000-general',
            email: 'general-user@example.com'
          },
          createdAt: '2024-01-03T00:00:00.000',
          updatedAt: '2024-01-03T00:00:00.000',
          deletedAt: null
        },
        {
          id: 'content-0000-0000-0000-general-1',
          contentId: 'content-0000-0000-0000-general',
          ionAssetId: 0,
          name: 'general content id asset1',
          displayName: 'GeneralContentId アセット1',
          isDisplay: true,
          status: 'CONVERTED',
          ionPercentComplete: 0,
          formatType: 'GEOJSON',
          customPosition: null,
          category: 'model3d',
          ionAssetType: 'GEOJSON',
          ehvAssetType: 'ehvTile',
          startDateTime: '2024-01-01T00:00:00.000',
          endDateTime: '2024-01-02T00:00:00.000',
          createdBy: {
            firstName: '共通',
            lastName: 'ユーザー',
            userId: 'user-0000-0000-0000-general',
            email: 'general-user@example.com'
          },
          createdAt: '2024-01-01T00:00:00.000',
          updatedAt: '2024-01-01T00:00:00.000',
          deletedAt: null
        }
      ],
      statusCode: 200
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
    assertion(config, response)
  })

  it('Normal system: Success (Specified)', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      queryString: 'limit=2&offset=1',
      expected: [
        {
          id: 'content-0000-0000-0000-general-2',
          contentId: 'content-0000-0000-0000-general',
          ionAssetId: 0,
          name: 'general content id asset2',
          displayName: 'GeneralContentId アセット2',
          isDisplay: true,
          status: 'CONVERTED',
          ionPercentComplete: 0,
          formatType: 'GEOJSON',
          customPosition: null,
          category: 'model3d',
          ionAssetType: 'GEOJSON',
          ehvAssetType: 'ehvTile',
          startDateTime: '2024-01-03T00:00:00.000',
          endDateTime: '2024-01-04T00:00:00.000',
          createdBy: {
            firstName: '共通',
            lastName: 'ユーザー',
            userId: 'user-0000-0000-0000-general',
            email: 'general-user@example.com'
          },
          createdAt: '2024-01-03T00:00:00.000',
          updatedAt: '2024-01-03T00:00:00.000',
          deletedAt: null
        },
        {
          id: 'content-0000-0000-0000-general-1',
          contentId: 'content-0000-0000-0000-general',
          ionAssetId: 0,
          name: 'general content id asset1',
          displayName: 'GeneralContentId アセット1',
          isDisplay: true,
          status: 'CONVERTED',
          ionPercentComplete: 0,
          formatType: 'GEOJSON',
          customPosition: null,
          category: 'model3d',
          ionAssetType: 'GEOJSON',
          ehvAssetType: 'ehvTile',
          startDateTime: '2024-01-01T00:00:00.000',
          endDateTime: '2024-01-02T00:00:00.000',
          createdBy: {
            firstName: '共通',
            lastName: 'ユーザー',
            userId: 'user-0000-0000-0000-general',
            email: 'general-user@example.com'
          },
          createdAt: '2024-01-01T00:00:00.000',
          updatedAt: '2024-01-01T00:00:00.000',
          deletedAt: null
        }
      ],
      statusCode: 200
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
    assertion(config, response)
  })

  it('Abnormal system: Authentication error', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      queryString: 'limit=2&offset=1',
      statusCode: 401
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
  })
})
