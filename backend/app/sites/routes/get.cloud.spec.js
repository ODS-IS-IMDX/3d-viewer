// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')

const buildFastify = require('../../../lib/test/build-fastify')
const { getUserToken } = require('../../../lib/test/auth')
const { resetDb, GENERAL_LOCATION } = require('../../../lib/test/cloud')
const { VIEW_STRUCTURE_DEFAULT } = require('../../assets/constants')
const { HEADER_KEY } = require('../../../lib/auth/constant')

const api = async ({
  server,
  accessUserId = 'user-0000-0000-0000-general',
  siteId,
  query = null,
  statusCode
}) => {
  const url = `/sites/${siteId}`
  return supertest(server)
    .get(url)
    .set(
      HEADER_KEY,
      accessUserId ? await getUserToken(accessUserId) : ''
    )
    .query(query)
    .expect(statusCode)
    .expect('Content-Type', 'application/json; charset=utf-8')
}

describe('GET `/sites/:siteId` Cloud', () => {
  let fastify

  before(async () => {
    await resetDb([
      'corporations',
      'users',
      'contents',
      'contents_resource_owners',
      'assets'
    ])

    fastify = buildFastify({ dbAdapter: 'cloud' })
    await fastify.ready()
  })

  after(async done => {
    await fastify.close(done)
  })

  it('Abnormal system (401): AccessToken not set', async () => {
    const config = {
      server: fastify.server,
      accessUserId: null,
      siteId: 'xxxxxx-0000-0000-0000-0000000000000',
      statusCode: 401
    }

    const response = await api(config)

    t.equal(response.body.statusCode, config.statusCode)
    t.equal(response.body.error, 'Unauthorized')
    t.equal(response.body.message, 'Login required')
  })

  it('Normal system: Manager', async () => {
    const config = {
      server: fastify.server,
      accessUserId: 'user-9999-9999-9999-admin',
      siteId: 'content-0000-0000-0000-get0001',
      statusCode: 200
    }

    const response = await api(config)

    const actual = response.body.data.site
    t.equal(actual.id, config.siteId)
    t.equal(actual.name, '正常系')
    t.deepEqual(actual.location, GENERAL_LOCATION)
    t.deepEqual(actual.externalServices, [])
    t.deepEqual(actual.viewStructure, { elements: VIEW_STRUCTURE_DEFAULT })
  })

  it('Normal system: No assets', async () => {
    const config = {
      server: fastify.server,
      siteId: 'content-0000-0000-0000-get0001',
      statusCode: 200
    }

    const response = await api(config)

    const actual = response.body.data.site
    t.equal(actual.id, config.siteId)
    t.equal(actual.name, '正常系')
    t.deepEqual(actual.location, GENERAL_LOCATION)
    t.deepEqual(actual.externalServices, [])
    t.deepEqual(actual.viewStructure, { elements: VIEW_STRUCTURE_DEFAULT })
  })

  it('Normal system: Asset included', async () => {
    const config = {
      server: fastify.server,
      siteId: 'content-get-viewStructure1',
      statusCode: 200
    }

    const response = await api(config)

    const actual = response.body.data.site
    t.equal(actual.id, config.siteId)
    t.equal(actual.name, '正常系')
    t.deepEqual(actual.location, GENERAL_LOCATION)
    t.deepEqual(actual.externalServices, [])
    t.deepEqual(actual.viewStructure, {
      elements: [
        {
          ...VIEW_STRUCTURE_DEFAULT[0],
          nodeID: 1,
          children: [
            {
              name: '2024年 2月',
              displayName: '2024年 2月',
              isDirectory: true,
              expanded: true,
              nodeID: 2,
              children: [
                {
                  name: 'viewStructure asset1-6',
                  displayName: 'viewStructure アセット1-6',
                  status: 'CONVERTING',
                  referenceId: 'content-get-viewStructure1-6',
                  ehvAssetType: 'ehvTile',
                  formatType: 'GEOJSON',
                  createdAt: new Date('2024-02-01T00:00:00').toISOString(),
                  nodeID: 3
                }
              ]
            },
            {
              name: '2024年 1月',
              displayName: '2024年 1月',
              isDirectory: true,
              expanded: true,
              nodeID: 4,
              children: [
                {
                  name: 'viewStructure asset1-1',
                  displayName: 'viewStructure アセット1-1',
                  status: 'CONVERTED',
                  referenceId: 'content-get-viewStructure1-1',
                  ehvAssetType: 'ehvTile',
                  formatType: 'GEOJSON',
                  createdAt: new Date('2024-01-01T00:00:00').toISOString(),
                  nodeID: 5
                }
              ]
            }
          ]
        },
        {
          ...VIEW_STRUCTURE_DEFAULT[1],
          nodeID: 6,
          children: [
            {
              name: '2024年 1月',
              displayName: '2024年 1月',
              isDirectory: true,
              expanded: true,
              nodeID: 7,
              children: [
                {
                  name: 'viewStructure asset1-2',
                  displayName: 'viewStructure アセット1-2',
                  status: 'CONVERTED',
                  referenceId: 'content-get-viewStructure1-2',
                  ehvAssetType: 'ehvSpaceInfo',
                  formatType: 'GEOJSON',
                  createdAt: new Date('2024-01-01T00:00:00').toISOString(),
                  nodeID: 8
                }
              ]
            }
          ]
        },
        {
          ...VIEW_STRUCTURE_DEFAULT[2],
          nodeID: 9,
          children: [
            {
              name: 'viewStructure asset1-3',
              displayName: 'viewStructure アセット1-3',
              status: 'CONVERTED',
              referenceId: 'content-get-viewStructure1-3',
              ehvAssetType: 'externalTileBe',
              formatType: 'GEOJSON',
              createdAt: new Date('2024-01-01T00:00:00').toISOString(),
              nodeID: 10
            }
          ]
        },
        {
          ...VIEW_STRUCTURE_DEFAULT[3],
          nodeID: 11,
          children: [
            {
              name: '承認前',
              displayName: '承認前',
              isDirectory: true,
              expanded: true,
              nodeID: 12,
              children: [
                {
                  name: 'viewStructure asset1-4',
                  displayName: 'viewStructure アセット1-4',
                  status: 'CONVERTED',
                  referenceId: 'content-get-viewStructure1-4',
                  ehvAssetType: 'externalSpaceInfoBe',
                  formatType: 'GEOJSON',
                  createdAt: new Date('2024-01-01T00:00:00').toISOString(),
                  nodeID: 13
                }
              ]
            },
            {
              name: '公開中',
              displayName: '公開中',
              isDirectory: true,
              expanded: true,
              nodeID: 14,
              children: [
                {
                  name: 'viewStructure asset1-5',
                  displayName: 'viewStructure アセット1-5',
                  status: 'CONVERTED',
                  referenceId: 'content-get-viewStructure1-5',
                  ehvAssetType: 'externalSpaceInfoAf',
                  formatType: 'GEOJSON',
                  createdAt: new Date('2024-01-01T00:00:00').toISOString(),
                  nodeID: 15
                },
                {
                  name: 'viewStructure asset1-7',
                  displayName: 'viewStructure アセット1-7',
                  status: 'CONVERTED',
                  referenceId: 'content-get-viewStructure1-7',
                  ehvAssetType: 'externalSpaceInfoAf',
                  formatType: 'GEOJSON',
                  createdAt: new Date('2024-01-01T00:00:00').toISOString(),
                  nodeID: 16
                }
              ]
            }
          ]
        }
      ]
    })
  })

  it('Abnormal system: Unknown asset type', async () => {
    const config = {
      server: fastify.server,
      siteId: 'content-get-viewStructure2',
      statusCode: 200
    }

    const response = await api(config)

    const actual = response.body.data.site
    t.equal(actual.id, config.siteId)
    t.equal(actual.name, '異常系')
    t.deepEqual(actual.location, GENERAL_LOCATION)
    t.deepEqual(actual.externalServices, [])
    t.deepEqual(actual.viewStructure, { elements: VIEW_STRUCTURE_DEFAULT })
  })

  it('Exception system: (404) Unknown ID', async () => {
    const config = {
      server: fastify.server,
      siteId: 'contents-unknown-identify',
      statusCode: 404
    }

    await api(config)
  })

  it('Abnormal system: (403) No access rights', async () => {
    const config = {
      server: fastify.server,
      siteId: 'content-0000-0000-0000-deleted',
      statusCode: 403
    }

    await api(config)
  })

  it('Abnormal system: (500)Generic error', async () => {
    await resetDb()

    const config = {
      server: fastify.server,
      siteId: '00000000-0000-0000-0000-000000000000',
      statusCode: 500
    }

    await api(config)
  })
})
