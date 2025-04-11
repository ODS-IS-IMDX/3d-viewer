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
  ASSET_CONTENT_ID,
  ASSET_USER_ID,
  ADMIN_USER_ID,
  resetFixturesDirectory,
  setFixturesDirectory
} = require('../../../lib/test/cloud')
const SQL = require('@nearform/sql')
const path = require('path')
const { mockClient } = require('aws-sdk-client-mock')
const { S3, PutObjectCommand } = require('@aws-sdk/client-s3')
const s3Mock = mockClient(S3)
const { ASSET_STATUS } = require('../../assets/constants')
const { HEADER_KEY } = require('../../../lib/auth/constant')

describe('PUT `/sites/:siteId/assets/:assetId` Cloud', () => {
  const api = async ({
    server,
    siteId,
    assetId,
    accessUserId,
    body = null
  }) => {
    const url = `/sites/${siteId}/assets/${assetId}/upload`
    return supertest(server)
      .put(url)
      .set(
        HEADER_KEY,
        accessUserId ? await getUserToken(accessUserId) : 'xxxxxxxxxxxxxxx'
      )
      .set('Content-Type', 'application/octet-stream')
      .send(body)
  }

  let fastify

  before(async () => {
    fastify = buildFastify({ dbAdapter: 'cloud' })
    await fastify.ready()
  })
  beforeEach(async () => {
    s3Mock.reset()
  })

  after(async done => {
    await fastify.close(done)
  })
  afterEach(async () => {
    resetFixturesDirectory()
  })

  it('Normal system: Success (space ID has)', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_wait/')
    )
    await resetDb([
      'assets',
      'assets_assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const uploadFile = Buffer.from('unit test las file data.')
    s3Mock.on(PutObjectCommand).resolves({
      ETag: '"AWSMockS3UploadEtag"',
      Location: 'AWSMockS3UploadLocation',
      key: 'AWSMockS3UploadKey',
      Bucket: 'AWSMockS3UploadBucket'
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ASSET_USER_ID,
      assetId: ASSET_CONTENT_ID + '-1',
      body: uploadFile,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latest3DTileAsset = await db.query(
      SQL`SELECT * FROM assets where id = ${ASSET_CONTENT_ID + '-1'}`
    )
    const latestSpaceInfoAsset = await db.query(
      SQL`SELECT * FROM assets where id = ${ASSET_CONTENT_ID + '-2'}`
    )
    const latest3DTileAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${ASSET_CONTENT_ID +
        '-1'}`
    )
    const latestSpaceInfoAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${ASSET_CONTENT_ID +
        '-2'}`
    )
    await db.end()

    t.equal(
      latest3DTileAsset[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(
      latest3DTileAsset[0][0].s3ObjectKey,
      `${latest3DTileAsset[0][0].contentId}_${latest3DTileAsset[0][0].id}_${latest3DTileAsset[0][0].name}`
    )
    t.equal(
      latest3DTileAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(latest3DTileAssetsHistory[0][0].userId, ASSET_USER_ID)

    t.equal(
      latestSpaceInfoAsset[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(
      latestSpaceInfoAsset[0][0].s3ObjectKey,
      `${latestSpaceInfoAsset[0][0].contentId}_${latestSpaceInfoAsset[0][0].id}_${latestSpaceInfoAsset[0][0].name}`
    )
    t.equal(
      latestSpaceInfoAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(latestSpaceInfoAssetsHistory[0][0].userId, ASSET_USER_ID)
  })

  it('Normal system: Success (space ID is not available)', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_wait/')
    )
    await resetDb([
      'assets',
      'assets_assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const uploadFile = Buffer.from('unit test las file data.')
    s3Mock.on(PutObjectCommand).resolves({
      ETag: '"AWSMockS3UploadEtag"',
      Location: 'AWSMockS3UploadLocation',
      key: 'AWSMockS3UploadKey',
      Bucket: 'AWSMockS3UploadBucket'
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ASSET_USER_ID,
      assetId: ASSET_CONTENT_ID + '-3',
      body: uploadFile,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAsset = await db.query(
      SQL`SELECT * FROM assets where id = ${config.assetId}`
    )
    const latestAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${config.assetId}`
    )
    await db.end()

    t.equal(latestAsset[0][0].status, ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS)
    t.equal(
      latestAsset[0][0].s3ObjectKey,
      `${latestAsset[0][0].contentId}_${latestAsset[0][0].id}_${latestAsset[0][0].name}`
    )
    t.equal(
      latestAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(latestAssetsHistory[0][0].userId, ASSET_USER_ID)
  })

  it('Normal system: Success (space ID has)', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_wait/')
    )
    await resetDb([
      'assets',
      'assets_assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const uploadFile = Buffer.from('unit test las file data.')
    s3Mock.on(PutObjectCommand).resolves({
      ETag: '"AWSMockS3UploadEtag"',
      Location: 'AWSMockS3UploadLocation',
      key: 'AWSMockS3UploadKey',
      Bucket: 'AWSMockS3UploadBucket'
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ASSET_USER_ID,
      assetId: ASSET_CONTENT_ID + '-1',
      body: uploadFile,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latest3DTileAsset = await db.query(
      SQL`SELECT * FROM assets where id = ${ASSET_CONTENT_ID + '-1'}`
    )
    const latestSpaceInfoAsset = await db.query(
      SQL`SELECT * FROM assets where id = ${ASSET_CONTENT_ID + '-2'}`
    )
    const latest3DTileAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${ASSET_CONTENT_ID +
        '-1'}`
    )
    const latestSpaceInfoAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${ASSET_CONTENT_ID +
        '-2'}`
    )
    await db.end()

    t.equal(
      latest3DTileAsset[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(
      latest3DTileAsset[0][0].s3ObjectKey,
      `${latest3DTileAsset[0][0].contentId}_${latest3DTileAsset[0][0].id}_${latest3DTileAsset[0][0].name}`
    )
    t.equal(
      latest3DTileAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(latest3DTileAssetsHistory[0][0].userId, ASSET_USER_ID)

    t.equal(
      latestSpaceInfoAsset[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(
      latestSpaceInfoAsset[0][0].s3ObjectKey,
      `${latestSpaceInfoAsset[0][0].contentId}_${latestSpaceInfoAsset[0][0].id}_${latestSpaceInfoAsset[0][0].name}`
    )
    t.equal(
      latestSpaceInfoAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(latestSpaceInfoAssetsHistory[0][0].userId, ASSET_USER_ID)
  })

  it('Abnormal system: S3 upload failed', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_wait/')
    )
    await resetDb([
      'assets',
      'assets_assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const uploadFile = Buffer.from('unit test las file data.')
    s3Mock.on(PutObjectCommand).rejects()
    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ASSET_USER_ID,
      assetId: ASSET_CONTENT_ID + '-1',
      body: uploadFile,
      statusCode: 500
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets where id = ${config.assetId}`
    )
    await db.end()
    t.equal(latestAssets[0][0].status, ASSET_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR)
  })

  it('Abnormal system: Non-existent assets', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_wait/')
    )
    await resetDb([
      'assets',
      'assets_assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const uploadFile = Buffer.from('unit test las file data.')
    s3Mock.on(PutObjectCommand).resolves({
      ETag: '"AWSMockS3UploadEtag"',
      Location: 'AWSMockS3UploadLocation',
      key: 'AWSMockS3UploadKey',
      Bucket: 'AWSMockS3UploadBucket'
    })
    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ASSET_USER_ID,
      assetId: ASSET_CONTENT_ID,
      body: uploadFile,
      statusCode: 404
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
  })

  it('Abnormal system: Authentication error', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_wait/')
    )
    await resetDb([
      'assets',
      'assets_assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const db = await createClient()
    const beforeAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID + '-3'}`
    )
    const uploadFile = Buffer.from('unit test las file data.')
    s3Mock.on(PutObjectCommand).resolves({
      ETag: '"AWSMockS3UploadEtag"',
      Location: 'AWSMockS3UploadLocation',
      key: 'AWSMockS3UploadKey',
      Bucket: 'AWSMockS3UploadBucket'
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      assetId: ASSET_CONTENT_ID + '-3',
      body: uploadFile,
      statusCode: 401
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${ASSET_CONTENT_ID + '-3'}`
    )
    await db.end()
    t.deepEqual(latestAssets, beforeAssets)
  })

  it('Normal system: Success (with spatial ID/administrator)', async () => {
    setFixturesDirectory(
      path.join(__dirname, '../../../fixtures/test/batch/s3_upload_wait/')
    )
    await resetDb([
      'assets',
      'assets_assets',
      'contents_resource_owners',
      'contents',
      'corporations',
      'users'
    ])
    const uploadFile = Buffer.from('unit test las file data.')
    s3Mock.on(PutObjectCommand).resolves({
      ETag: '"AWSMockS3UploadEtag"',
      Location: 'AWSMockS3UploadLocation',
      key: 'AWSMockS3UploadKey',
      Bucket: 'AWSMockS3UploadBucket'
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ADMIN_USER_ID,
      assetId: ASSET_CONTENT_ID + '-1',
      body: uploadFile,
      statusCode: 204
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latest3DTileAsset = await db.query(
      SQL`SELECT * FROM assets where id = ${ASSET_CONTENT_ID + '-1'}`
    )
    const latestSpaceInfoAsset = await db.query(
      SQL`SELECT * FROM assets where id = ${ASSET_CONTENT_ID + '-2'}`
    )
    const latest3DTileAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${ASSET_CONTENT_ID +
        '-1'}`
    )
    const latestSpaceInfoAssetsHistory = await db.query(
      SQL`SELECT * FROM assets_history WHERE assetId = ${ASSET_CONTENT_ID +
        '-2'}`
    )
    await db.end()

    t.equal(
      latest3DTileAsset[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(
      latest3DTileAsset[0][0].s3ObjectKey,
      `${latest3DTileAsset[0][0].contentId}_${latest3DTileAsset[0][0].id}_${latest3DTileAsset[0][0].name}`
    )
    t.equal(
      latest3DTileAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(latest3DTileAssetsHistory[0][0].userId, ADMIN_USER_ID)

    t.equal(
      latestSpaceInfoAsset[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(
      latestSpaceInfoAsset[0][0].s3ObjectKey,
      `${latestSpaceInfoAsset[0][0].contentId}_${latestSpaceInfoAsset[0][0].id}_${latestSpaceInfoAsset[0][0].name}`
    )
    t.equal(
      latestSpaceInfoAssetsHistory[0][0].status,
      ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS
    )
    t.equal(latestSpaceInfoAssetsHistory[0][0].userId, ADMIN_USER_ID)
  })
})
