// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')
const buildFastify = require('../../../lib/test/build-fastify')
const {
  resetDb,
  createClient,
  ASSET_USER_ID,
  ASSET_CONTENT_ID,
  resetFixturesDirectory,
  setFixturesDirectory
} = require('../../../lib/test/cloud')
const SQL = require('@nearform/sql')
const path = require('path')
const { mockClient } = require('aws-sdk-client-mock')
const {
  S3,
  HeadObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3')
const s3Mock = mockClient(S3)
const {
  ASSET_STATUS,
  CESIUM_ION_API_TYPE_INFO,
  EHV_ASSET_TYPE,
  ASSET_CATEGORY,
  ASSET_FORMAT_TYPE
} = require('../../assets/constants')
const config = require('../../../config')
const { nock } = require('../../../lib/test/nock')
const cesiumIonApi = require('../../../lib/external/cesium-ion-api')
const sinon = require('sinon')

describe('PATCH `/assets` Cloud', () => {
  const cesiumIonAccessToken = 'abcdefg12345'
  const api = async ({ server }) => {
    const url = `/assets`
    return supertest(server).patch(url)
  }

  let fastify, cfg

  before(async () => {
    fastify = buildFastify({ dbAdapter: 'cloud' })
    await fastify.ready()
    cfg = await config()
    nock.before()
  })
  after(async done => {
    await fastify.close(done)
    await nock.after()
  })

  beforeEach(async () => {
    s3Mock.reset()
  })
  afterEach(async () => {
    resetFixturesDirectory()
  })

  it('internalBatchVirusScanResultCheck: Scanning (no change)', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_virus_scan_in_progress/3d_tiles'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    s3Mock.on(HeadObjectCommand).rejects({
      $metadata: {
        httpStatusCode: 404
      }
    })
    s3Mock.on(GetObjectCommand).resolves()

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS)
    t.equal(latestAssetsHistory[0].length, 0)
  })

  it('internalBatchVirusScanResultCheck:Scan result is not allowed', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_virus_scan_in_progress/3d_tiles'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    s3Mock
      .on(HeadObjectCommand)
      .rejectsOnce({
        $metadata: {
          httpStatusCode: 404
        }
      })
      .resolvesOnce({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand)
      .resolvesOnce()
      .resolvesOnce({
        Body: {
          transformToByteArray: () => {}
        }
      })

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.S3_VIRUS_SCAN_RESULT_NG)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${latestAssets[0][0].contentId}_${latestAssets[0][0].id}_${latestAssets[0][0].name}`
    )
    t.equal(
      latestAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_RESULT_NG
    )
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchVirusScanResultCheck:Scan results OK/3DTile', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_virus_scan_in_progress/3d_tiles'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    s3Mock
      .on(HeadObjectCommand)
      .resolvesOnce({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
      .rejectsOnce({
        $metadata: {
          httpStatusCode: 404
        }
      })
    s3Mock
      .on(GetObjectCommand)
      .resolvesOnce({
        Body: {
          transformToByteArray: () => {}
        }
      })
      .resolvesOnce()

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.S3_UPLOAD_COMPLETE)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.tile.las.input}/${latestAssets[0][0].contentId}/${latestAssets[0][0].id}/${latestAssets[0][0].name}`
    )
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.S3_UPLOAD_COMPLETE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchVirusScanResultCheck:Scan result OK/Spatial ID', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_virus_scan_in_progress/space_info'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    s3Mock
      .on(HeadObjectCommand)
      .resolvesOnce({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
      .rejectsOnce({
        $metadata: {
          httpStatusCode: 404
        }
      })
    s3Mock
      .on(GetObjectCommand)
      .resolvesOnce({
        Body: {
          transformToByteArray: () => {}
        }
      })
      .resolvesOnce()

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(
      latestAssets[0][0].status,
      ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL
    )
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.convertTool.input}/${latestAssets[0][0].contentId}_${latestAssets[0][0].id}_${latestAssets[0][0].name}`
    )
    t.equal(
      latestAssetsHistory[0][0].status,
      ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL
    )
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchCesiumIonCreateAsset:CesiumIon Asset Creation Request Failed', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_complete/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    nock.post(cfg.asset.cesiumIon.host, '/v1/assets').reply(503)

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.CONVERT_ERROR)
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.CONVERT_ERROR)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchCesiumIonCreateAsset:CesiumIon Asset Creation Request Successfully', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_complete/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 12345,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 100
      }
    }

    nock.post(cfg.asset.cesiumIon.host, '/v1/assets').reply(200, {
      assetMetadata: config.expected
    })

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].ionAssetId, config.expected.id)
    t.equal(latestAssets[0][0].ionType, config.expected.type)
    t.equal(
      latestAssets[0][0].ionPercentComplete,
      config.expected.percentComplete
    )
    t.equal(latestAssets[0][0].status, ASSET_STATUS.CONVERTING)
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.CONVERTING)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchCheckAssetConvertingProgress: CesiumIon asset conversion in progress', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/converting/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 112233,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 35
      }
    }

    nock.get(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(200, {
      status: cesiumIonApi.STATUS.IN_PROGRESS,
      ...config.expected
    })

    const db = await createClient()
    const assets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const fakeSystemDate = sinon.useFakeTimers(new Date(assets[0][0].updatedAt))

    const response = await api(config)
    fakeSystemDate.restore()
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].ionAssetId, config.expected.id)
    t.equal(latestAssets[0][0].ionType, config.expected.type)
    t.equal(
      latestAssets[0][0].ionPercentComplete,
      config.expected.percentComplete
    )
    t.equal(latestAssets[0][0].status, ASSET_STATUS.CONVERTING)
    t.equal(latestAssetsHistory[0].length, 0)
  })

  it('internalBatchCheckAssetConvertingProgress: Forced deletion due to a certain period of time passed', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/converting/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 112233,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 0
      }
    }

    const db = await createClient()
    const assets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const fakeSystemDate = sinon.useFakeTimers(
      new Date(assets[0][0].updatedAt).getTime() +
        cfg.asset.ehv.availableTime +
        1
    )
    const response = await api(config)
    fakeSystemDate.restore()
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].ionAssetId, config.expected.id)
    t.equal(latestAssets[0][0].ionType, config.expected.type)
    t.equal(
      latestAssets[0][0].ionPercentComplete,
      config.expected.percentComplete
    )
    t.equal(latestAssets[0][0].status, ASSET_STATUS.DELETE_WAIT)
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.DELETE_WAIT)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchCheckAssetConvertingProgress:CesiumIon asset conversion failed (normal error)', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/converting/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 112233,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 35
      }
    }

    s3Mock.on(CopyObjectCommand).resolves()
    s3Mock.on(DeleteObjectCommand).resolves()

    nock.get(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(200, {
      status: cesiumIonApi.STATUS.ERROR,
      ...config.expected
    })

    const db = await createClient()
    const assets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const fakeSystemDate = sinon.useFakeTimers(new Date(assets[0][0].updatedAt))

    const response = await api(config)
    fakeSystemDate.restore()
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].status, ASSET_STATUS.CONVERT_ERROR)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.tile.las.error}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${latestAssets[0][0].name}`
    )
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.CONVERT_ERROR)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchCheckAssetConvertingProgress:CesiumIon asset conversion failed (data error)', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/converting/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 112233,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 35
      }
    }

    s3Mock.on(CopyObjectCommand).resolves()
    s3Mock.on(DeleteObjectCommand).resolves()

    nock.get(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(200, {
      status: cesiumIonApi.STATUS.DATA_ERROR,
      ...config.expected
    })

    const db = await createClient()
    const assets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const fakeSystemDate = sinon.useFakeTimers(new Date(assets[0][0].updatedAt))

    const response = await api(config)
    fakeSystemDate.restore()
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].status, ASSET_STATUS.CONVERT_ERROR)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.tile.las.error}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${latestAssets[0][0].name}`
    )
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.CONVERT_ERROR)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchCheckAssetConvertingProgress:CesiumIon asset conversion successful', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/converting/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 112233,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 100
      }
    }

    s3Mock.on(CopyObjectCommand).resolves()
    s3Mock.on(DeleteObjectCommand).resolves()

    nock.get(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(200, {
      status: cesiumIonApi.STATUS.COMPLETE,
      ...config.expected
    })

    const db = await createClient()
    const assets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const fakeSystemDate = sinon.useFakeTimers(new Date(assets[0][0].updatedAt))

    const response = await api(config)
    fakeSystemDate.restore()
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].status, ASSET_STATUS.CONVERTED)
    t.equal(
      latestAssets[0][0].ionPercentComplete,
      config.expected.percentComplete
    )
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.CONVERTED)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchGetConvertedSpaceInfoFile: Segment tool conversion (no change)', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_upload_complete_to_convert_tool/'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    s3Mock.on(HeadObjectCommand).rejects({
      $metadata: {
        httpStatusCode: 404
      }
    })
    s3Mock.on(GetObjectCommand).rejects()

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(
      latestAssets[0][0].status,
      ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL
    )
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.convertTool.input}/${latestAssets[0][0].contentId}_${latestAssets[0][0].id}_${latestAssets[0][0].name}`
    )
    t.equal(latestAssetsHistory[0].length, 0)
  })

  it('internalBatchGetConvertedSpaceInfoFile: Segment tool conversion failed', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_upload_complete_to_convert_tool/'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const db = await createClient()
    const assets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )

    s3Mock
      .on(HeadObjectCommand)
      .rejectsOnce({
        $metadata: {
          httpStatusCode: 404
        }
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock.on(GetObjectCommand).resolves({
      Body: {
        transformToString: () => {
          return JSON.stringify({
            'error-info': 'error-info'
          })
        }
      }
    })
    s3Mock.on(ListObjectsV2Command).resolves({
      KeyCount: 1,
      Contents: [
        {
          Size: 1024,
          Key: `${cfg.asset.ehv.prefixes.convertTool.error}/${assets[0][0].contentId}_${assets[0][0].id}_error_info.json`
        }
      ]
    })

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.CONVERT_TOOL_ERROR)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.convertTool.error}/${latestAssets[0][0].contentId}_${latestAssets[0][0].id}_${latestAssets[0][0].name}`
    )
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.CONVERT_TOOL_ERROR)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchGetConvertedSpaceInfoFile:Successful segment tool conversion conversion', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_upload_complete_to_convert_tool/'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const db = await createClient()
    await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )

    s3Mock.on(HeadObjectCommand).resolvesOnce({
      ETag: '"AWSMockS3DownloadEtag"',
      Location: 'AWSMockS3DownloadLocation',
      key: 'AWSMockS3DownloadKey',
      Bucket: 'AWSMockS3DownloadBucket'
    })
    s3Mock.on(GetObjectCommand).resolvesOnce({
      Body: {
        transformToString: () => {}
      }
    })
    s3Mock.on(CopyObjectCommand).resolvesOnce()
    s3Mock.on(DeleteObjectCommand).resolvesOnce()

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(
      latestAssets[0][0].status,
      ASSET_STATUS.S3_COPY_COMPLETE_FROM_CONVERT_TOOL
    )
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.tile.las.input}/${latestAssets[0][0].contentId}/${latestAssets[0][0].id}/${latestAssets[0][0].name}`
    )
    t.equal(
      latestAssetsHistory[0][0].status,
      ASSET_STATUS.S3_COPY_COMPLETE_FROM_CONVERT_TOOL
    )
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchDeleteAsset:Deletion failed/CesiumIon asset deletion request failed', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/delete_wait/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(404)

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.DELETE_ERROR)
    t.equal(latestAssets[0][0].deletedAt, null)
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.DELETE_ERROR)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchDeleteAsset:Deletion failed/S3 deletion failed', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/delete_wait/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(204)
    s3Mock.on(DeleteObjectCommand).rejects({
      $metadata: {
        httpStatusCode: 404
      }
    })

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.DELETE_ERROR)
    t.equal(latestAssets[0][0].deletedAt, null)
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.DELETE_ERROR)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchDeleteAsset:Deletion is successful', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/delete_wait/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(204)
    s3Mock.on(DeleteObjectCommand).resolves()

    const config = {
      server: fastify.server,
      statusCode: 204
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.DELETE_COMPLETE)
    t.notEqual(latestAssets[0][0].deletedAt, null)
    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.DELETE_COMPLETE)
    t.equal(latestAssetsHistory[0][0].userId, ASSET_USER_ID)
  })

  it('internalBatchUpsertExternalLinkFile: No external linkage file', async () => {
    await resetDb([
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    s3Mock.on(ListObjectsV2Command).resolves({
      KeyCount: 0,
      Contents: null
    })
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    await db.end()
    t.equal(latestAssets[0].length, 0)
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file available / CityGML / Invalid file type', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/city_gml/add_asset'
      )
    )
    await resetDb([
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.csv`
    const fileS3Key = `${cfg.asset.b2.prefixes.tile.approval.before}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(SQL`SELECT * FROM assets`)
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history`
    )
    await db.end()

    t.equal(latestAssets[0].length, 0)
    t.equal(latestAssetsHistory[0].length, 0)
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file available / CityGML / No existing assets', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/city_gml/add_asset'
      )
    )
    await resetDb([
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.b2.prefixes.tile.approval.before}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(latestAssets[0][0].ehvAssetType, EHV_ASSET_TYPE.EXTERNAL_TILE_AF)
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.tile.cityGml.input}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 0)
    t.equal(latestAssets[0][0].isApproval, 1)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.S3_UPLOAD_COMPLETE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file available / CityGML / Existing assets available', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/city_gml/update_asset'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.b2.prefixes.tile.approval.before}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(204)
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const db = await createClient()
    const noUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE}`
    )
    t.equal(noUpdateAsset[0].length, 1)

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    const latestNoUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(latestAssets[0][0].ehvAssetType, EHV_ASSET_TYPE.EXTERNAL_TILE_AF)
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.tile.cityGml.input}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 0)
    t.equal(latestAssets[0][0].isApproval, 1)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.EXTENAL_UPDATE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)

    t.deepEqual(latestNoUpdateAsset[0], noUpdateAsset[0])
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / CityGML / Existing assets included / CesiumIon deletion failed', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/city_gml/update_asset'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.b2.prefixes.tile.approval.before}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(404)
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const db = await createClient()
    const noUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE}`
    )
    t.equal(noUpdateAsset[0].length, 1)

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    const latestNoUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(latestAssets[0][0].ehvAssetType, EHV_ASSET_TYPE.EXTERNAL_TILE_AF)
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.tile.cityGml.input}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 0)
    t.equal(latestAssets[0][0].isApproval, 1)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.EXTENAL_UPDATE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)

    t.deepEqual(latestNoUpdateAsset[0], noUpdateAsset[0])
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (before approval) / Invalid file type', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/before/add_asset'
      )
    )
    await resetDb([
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.csv`
    const fileS3Key = `${cfg.asset.b2.prefixes.spaceInfo.approval.before}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(SQL`SELECT * FROM assets`)
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history`
    )
    await db.end()

    t.equal(latestAssets[0].length, 0)
    t.equal(latestAssetsHistory[0].length, 0)
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (before approval) / No existing assets', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/before/add_asset'
      )
    )
    await resetDb([
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.b2.prefixes.spaceInfo.approval.before}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(
      latestAssets[0][0].ehvAssetType,
      EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE
    )
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.spaceInfo.input.approval.before}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 1)
    t.equal(latestAssets[0][0].isApproval, 0)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.S3_UPLOAD_COMPLETE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (before approval) / Existing assets included', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/before/update_asset'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.ehv.prefixes.tile.las.input}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(204)
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const db = await createClient()
    const noUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    t.equal(noUpdateAsset[0].length, 1)

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    const latestNoUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(
      latestAssets[0][0].ehvAssetType,
      EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE
    )
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.spaceInfo.input.approval.before}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 1)
    t.equal(latestAssets[0][0].isApproval, 0)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.EXTENAL_UPDATE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)

    t.deepEqual(latestNoUpdateAsset[0], noUpdateAsset[0])
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (before approval) / Existing assets included / CesiumIon deletion failed', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/before/update_asset'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.ehv.prefixes.tile.las.input}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(404)
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const db = await createClient()
    const noUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    t.equal(noUpdateAsset[0].length, 1)

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    const latestNoUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(
      latestAssets[0][0].ehvAssetType,
      EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE
    )
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.spaceInfo.input.approval.before}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 1)
    t.equal(latestAssets[0][0].isApproval, 0)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.EXTENAL_UPDATE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)

    t.deepEqual(latestNoUpdateAsset[0], noUpdateAsset[0])
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (after approval) / Invalid file type', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/after/add_asset'
      )
    )
    await resetDb([
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.csv`
    const fileS3Key = `${cfg.asset.b2.prefixes.spaceInfo.approval.after}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(SQL`SELECT * FROM assets`)
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history`
    )
    await db.end()

    t.equal(latestAssets[0].length, 0)
    t.equal(latestAssetsHistory[0].length, 0)
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (after approval) / No existing assets', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/after/add_asset'
      )
    )
    await resetDb([
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.b2.prefixes.spaceInfo.approval.after}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(
      latestAssets[0][0].ehvAssetType,
      EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF
    )
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.spaceInfo.input.approval.after}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 1)
    t.equal(latestAssets[0][0].isApproval, 1)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.S3_UPLOAD_COMPLETE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (after approval) / Existing assets included', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/after/update_asset'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.ehv.prefixes.tile.las.input}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(204)
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const db = await createClient()
    const noUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    t.equal(noUpdateAsset[0].length, 1)

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    const latestNoUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(
      latestAssets[0][0].ehvAssetType,
      EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF
    )
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.spaceInfo.input.approval.after}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 1)
    t.equal(latestAssets[0][0].isApproval, 1)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.EXTENAL_UPDATE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)

    t.deepEqual(latestNoUpdateAsset[0], noUpdateAsset[0])
  })

  it('internalBatchUpsertExternalLinkFile: External linkage file included / Spatial ID (after approval) / Existing assets included / CesiumIon deletion failed', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/external_link/space_info/after/update_asset'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const fileName = `unit_test.zip`
    const fileS3Key = `${cfg.asset.ehv.prefixes.tile.las.input}/${ASSET_CONTENT_ID}_${fileName}`
    s3Mock
      .on(ListObjectsV2Command)
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 0,
        Contents: null
      })
      .resolvesOnce({
        KeyCount: 1,
        Contents: [
          {
            Size: 1024,
            Key: fileS3Key
          }
        ]
      })
    s3Mock
      .on(HeadObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        ETag: '"AWSMockS3DownloadEtag"',
        Location: 'AWSMockS3DownloadLocation',
        key: 'AWSMockS3DownloadKey',
        Bucket: 'AWSMockS3DownloadBucket'
      })
    s3Mock
      .on(GetObjectCommand, {
        Bucket: cfg.asset.b2.bucket,
        Key: fileS3Key
      })
      .resolves({
        Body: {
          transformToByteArray: () => {}
        }
      })
    nock.delete(cfg.asset.cesiumIon.host, '/v1/assets/112233').reply(404)
    const config = {
      server: fastify.server,
      statusCode: 204
    }

    const db = await createClient()
    const noUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    t.equal(noUpdateAsset[0].length, 1)

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${latestAssets[0][0].id}`
    )
    const latestNoUpdateAsset = await db.query(
      SQL`SELECT * FROM assets WHERE ehvAssetType = ${EHV_ASSET_TYPE.EXTERNAL_TILE_AF}`
    )
    await db.end()

    t.equal(latestAssets[0][0].contentId, ASSET_CONTENT_ID)
    t.equal(
      latestAssets[0][0].ehvAssetType,
      EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF
    )
    t.equal(latestAssets[0][0].ionAssetId, 0)
    t.equal(latestAssets[0][0].ionOnComplete, null)
    t.equal(latestAssets[0][0].ionPercentComplete, 0)
    t.equal(
      latestAssets[0][0].s3ObjectKey,
      `${cfg.asset.ehv.prefixes.spaceInfo.input.approval.after}/${ASSET_CONTENT_ID}/${latestAssets[0][0].id}/${fileName}`
    )
    t.equal(latestAssets[0][0].name, fileName)
    t.equal(latestAssets[0][0].displayName, fileName)
    t.equal(latestAssets[0][0].category, ASSET_CATEGORY.DESIGN_FILE)
    t.equal(latestAssets[0][0].formatType, ASSET_FORMAT_TYPE.GLTF)
    t.equal(
      latestAssets[0][0].linkageFileName,
      `${ASSET_CONTENT_ID}_${fileName}`
    )
    t.equal(latestAssets[0][0].isSpace, 1)
    t.equal(latestAssets[0][0].isApproval, 1)
    t.equal(latestAssets[0][0].ionType, CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D)
    t.equal(
      latestAssets[0][0].ionSourceType,
      CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D
    )
    t.equal(latestAssets[0][0].createdBy, cfg.asset.ehv.systemUserId)
    t.equal(latestAssets[0][0].updatedBy, cfg.asset.ehv.systemUserId)

    t.equal(latestAssetsHistory[0][0].status, ASSET_STATUS.EXTENAL_UPDATE)
    t.equal(latestAssetsHistory[0][0].userId, cfg.asset.ehv.systemUserId)

    t.deepEqual(latestNoUpdateAsset[0], noUpdateAsset[0])
  })

  it('CesiumIon request header generation: Access token setting available', async () => {
    process.env.CESIUM_ION_ACCESS_TOKEN = cesiumIonAccessToken
    fastify.config = await config()
    const expected = {
      Authorization: `Bearer ${cesiumIonAccessToken}`,
      'Content-Type': 'application/json'
    }
    const headers = cesiumIonApi.generateHeader(fastify)
    t.deepEqual(headers, expected)
  })

  it('CesiumIon request header generation: No access token settings', async () => {
    process.env.CESIUM_ION_ACCESS_TOKEN = ''
    fastify.config = await config()

    const expected = {
      'Content-Type': 'application/json'
    }
    const headers = cesiumIonApi.generateHeader(fastify)
    t.deepEqual(headers, expected)

    process.env.CESIUM_ION_ACCESS_TOKEN = cesiumIonAccessToken
  })

  it('internalBatchCesiumIonCreateAsset:Do not exceed the maximum number of registered items/No conversion', async () => {
    setFixturesDirectory(
      path.join(
        __dirname,
        '../../../fixtures/test/batch/s3_upload_complete_30/'
      )
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const db = await createClient()
    const sql = SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND status = ${ASSET_STATUS.CONVERTING}`
    const initialAssets = await db.query(sql)
    t.equal(initialAssets[0].length, 0)

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 12345,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 100
      }
    }

    nock
      .post(cfg.asset.cesiumIon.host, '/v1/assets')
      .reply(200, {
        assetMetadata: config.expected
      })
      .times(100)

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(sql)
    await db.end()

    t.equal(latestAssets[0].length, cfg.asset.ehv.assetBatchConvertLimit)
  })

  it('internalBatchCesiumIonCreateAsset:Do not exceed the maximum number of registered items/5 items being converted', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/converting_5/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const db = await createClient()
    const sql = SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND status = ${ASSET_STATUS.CONVERTING}`
    const initialAssets = await db.query(sql)
    t.equal(initialAssets[0].length, 5)

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 12345,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 25
      }
    }

    nock
      .post(cfg.asset.cesiumIon.host, '/v1/assets')
      .reply(200, {
        assetMetadata: config.expected
      })
      .times(100)

    const fakeSystemDate = sinon.useFakeTimers(
      new Date(initialAssets[0][0].updatedAt).getTime()
    )
    const response = await api(config)
    fakeSystemDate.restore()
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(sql)
    await db.end()

    t.equal(latestAssets[0].length, cfg.asset.ehv.assetBatchConvertLimit)
  })

  it('internalBatchCesiumIonCreateAsset:Do not exceed the maximum number of registered items/10 items are being converted.', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/converting_10/')
    )
    await resetDb([
      'assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])

    const db = await createClient()
    const sql = SQL`SELECT * FROM assets WHERE contentId = ${ASSET_CONTENT_ID} AND status = ${ASSET_STATUS.CONVERTING}`
    const initialAssets = await db.query(sql)
    t.equal(initialAssets[0].length, 10)

    const config = {
      server: fastify.server,
      statusCode: 204,
      expected: {
        id: 12345,
        type: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        percentComplete: 100
      }
    }

    nock
      .post(cfg.asset.cesiumIon.host, '/v1/assets')
      .reply(200, {
        assetMetadata: config.expected
      })
      .times(100)

    const fakeSystemDate = sinon.useFakeTimers(
      new Date(initialAssets[0][0].updatedAt).getTime()
    )
    const response = await api(config)
    fakeSystemDate.restore()
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(sql)
    await db.end()

    t.equal(latestAssets[0].length, cfg.asset.ehv.assetBatchConvertLimit)
  })
})
