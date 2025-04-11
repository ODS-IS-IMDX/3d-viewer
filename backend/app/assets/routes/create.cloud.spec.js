// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')
const buildFastify = require('../../../lib/test/build-fastify')
const { getUserToken } = require('../../../lib/test/auth')
const {
  resetDb,
  createClient,
  GENERAL_USER_ID,
  GENERAL_CONTENT_ID
} = require('../../../lib/test/cloud')
const SQL = require('@nearform/sql')
const {
  EHV_ASSET_TYPE,
  ASSET_STATUS,
  ASSET_CATEGORY,
  ASSET_FORMAT_TYPE,
  CESIUM_ION_API_TYPE_INFO
} = require('../constants')
const { HEADER_KEY } = require('../../../lib/auth/constant')

describe('POST `/sites/:siteId/assets` Cloud', () => {
  const api = async ({
    server,
    siteId,
    accessUserId,
    body = null,
    statusCode
  }) => {
    const url = `/sites/${siteId}/assets`
    return supertest(server)
      .post(url)
      .set(
        HEADER_KEY,
        accessUserId ? await getUserToken(accessUserId) : 'xxxxxxxxxxxxxxx'
      )
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(body)
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
      'contents_resource_owners'
    ])
  })

  after(async done => {
    await fastify.close(done)
  })

  it('Normal system: Success (space ID is not available)', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      body: {
        name: 'unit-test.las',
        displayName: '単体テストLASファイル',
        isSpace: false
      },
      statusCode: 201,
      expected: {
        contentId: GENERAL_CONTENT_ID,
        ehvAssetType: EHV_ASSET_TYPE.EHV_TILE,
        ionAssetId: null,
        ionOnComplete: null,
        s3ObjectKey: null,
        name: 'unit-test.las',
        displayName: '単体テストLASファイル',
        status: ASSET_STATUS.S3_UPLOAD_WAIT,
        category: ASSET_CATEGORY.TOPOGRAPHY,
        formatType: ASSET_FORMAT_TYPE.LASER,
        customPosition: null,
        customStyle: null,
        linkageFileName: null,
        isSpace: 0,
        isApproval: null,
        ionType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        ionSourceType: CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.POINT_CLOUD,
        cesiumOptions: {},
        startDateTime: null,
        endDateTime: null,
        createdBy: GENERAL_USER_ID,
        updatedBy: GENERAL_USER_ID
      }
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(SQL`SELECT * FROM assets`)
    await db.end()
    t.equal(latestAssets[0].length, 1)

    Object.keys(config.expected).forEach(key => {
      t.deepEqual(latestAssets[0][0][key], config.expected[key])
    })
  })

  it('Normal system: Success (space ID has)', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      body: {
        name: 'unit-test.las',
        displayName: '単体テストLASファイル',
        isSpace: true
      },
      statusCode: 201,
      expected: [
        {
          contentId: GENERAL_CONTENT_ID,
          ehvAssetType: EHV_ASSET_TYPE.EHV_TILE,
          ionAssetId: null,
          ionOnComplete: null,
          s3ObjectKey: null,
          name: 'unit-test.las',
          displayName: '単体テストLASファイル',
          status: ASSET_STATUS.S3_UPLOAD_WAIT,
          category: ASSET_CATEGORY.TOPOGRAPHY,
          formatType: ASSET_FORMAT_TYPE.LASER,
          customPosition: null,
          customStyle: null,
          linkageFileName: null,
          isSpace: 0,
          isApproval: null,
          ionType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
          ionSourceType: CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.POINT_CLOUD,
          cesiumOptions: {},
          startDateTime: null,
          endDateTime: null,
          createdBy: GENERAL_USER_ID,
          updatedBy: GENERAL_USER_ID
        },
        {
          contentId: GENERAL_CONTENT_ID,
          ehvAssetType: EHV_ASSET_TYPE.EHV_SPACE_INFO,
          ionAssetId: null,
          ionOnComplete: null,
          s3ObjectKey: null,
          name: 'unit-test.las',
          displayName: '単体テストLASファイル',
          status: ASSET_STATUS.S3_UPLOAD_WAIT,
          category: ASSET_CATEGORY.DESIGN_FILE,
          formatType: ASSET_FORMAT_TYPE.GLTF,
          customPosition: null,
          customStyle: null,
          linkageFileName: null,
          isSpace: 1,
          isApproval: null,
          ionType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
          ionSourceType: CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D,
          cesiumOptions: {
            tilesetJsonPath: '/tileset.json'
          },
          startDateTime: null,
          endDateTime: null,
          createdBy: GENERAL_USER_ID,
          updatedBy: GENERAL_USER_ID
        }
      ]
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    for await (const expected of config.expected) {
      const db = await createClient()
      const latestAssets = await db.query(
        SQL`SELECT * FROM assets WHERE ehvAssetType = ${expected.ehvAssetType}`
      )
      await db.end()
      t.equal(latestAssets[0].length, 1)
      Object.keys(expected).forEach(key => {
        t.deepEqual(latestAssets[0][0][key], expected[key])
      })
    }
  })

  it('Abnormal system: Authentication error', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      body: {
        name: 'unit-test.las',
        displayName: '単体テストLASファイル',
        isSpace: false
      },
      statusCode: 401
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(SQL`SELECT * FROM assets`)
    await db.end()
    t.equal(latestAssets[0].length, 0)
  })

  it('Abnormal system: Validation error (required parameters are missing)', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      statusCode: 400
    }

    const paramPattern = [
      {
        name: 'unit-test.las'
      },
      {
        displayName: '単体テストLASファイル'
      },
      {
        isSpace: false
      },
      {
        displayName: '単体テストLASファイル',
        isSpace: false
      },
      {
        name: 'unit-test.las',
        isSpace: false
      },
      {
        name: 'unit-test.las',
        displayName: '単体テストLASファイル'
      }
    ]

    for (const params of paramPattern) {
      const response = await api({ ...config, ...{ body: params } })
      t.equal(response.statusCode, config.statusCode)
    }

    const db = await createClient()
    const latestAssets = await db.query(SQL`SELECT * FROM assets`)
    await db.end()
    t.equal(latestAssets[0].length, 0)
  })
})
