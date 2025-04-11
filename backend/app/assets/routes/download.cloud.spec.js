// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')
const buildFastify = require('../../../lib/test/build-fastify')
const { getUserToken } = require('../../../lib/test/auth')
const {
  resetDb,
  ASSET_CONTENT_ID,
  ASSET_USER_ID
} = require('../../../lib/test/cloud')
const { mockClient } = require('aws-sdk-client-mock')
const {
  S3,
  HeadObjectCommand,
  GetObjectCommand
} = require('@aws-sdk/client-s3')
const s3Mock = mockClient(S3)
const { HEADER_KEY } = require('../../../lib/auth/constant')

describe('GET `/sites/:siteId/assets/:assetId/download` Cloud', () => {
  const api = async ({ server, siteId, assetId, accessUserId }) => {
    const url = `/sites/${siteId}/assets/${assetId}/download`
    return supertest(server)
      .get(url)
      .set(
        HEADER_KEY,
        accessUserId ? await getUserToken(accessUserId) : 'xxxxxxxxxxxxxxx'
      )
      .set('Content-Type', 'application/json')
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
    s3Mock.reset()
  })

  after(async done => {
    await fastify.close(done)
  })

  it('Normal system: Success', async () => {
    s3Mock.on(HeadObjectCommand).resolves({
      ETag: '"AWSMockS3DownloadEtag"',
      Location: 'AWSMockS3DownloadLocation',
      key: 'AWSMockS3DownloadKey',
      Bucket: 'AWSMockS3DownloadBucket'
    })
    s3Mock.on(GetObjectCommand).resolves({
      Body: {
        transformToByteArray: () => {}
      }
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ASSET_USER_ID,
      assetId: ASSET_CONTENT_ID + '-1',
      statusCode: 200
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
  })

  it('Abnormal system: Non-existent assets', async () => {
    s3Mock.on(HeadObjectCommand).resolves({
      ETag: '"AWSMockS3DownloadEtag"',
      Location: 'AWSMockS3DownloadLocation',
      key: 'AWSMockS3DownloadKey',
      Bucket: 'AWSMockS3DownloadBucket'
    })
    s3Mock.on(GetObjectCommand).resolves({
      Body: {
        transformToByteArray: () => {}
      }
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      accessUserId: ASSET_USER_ID,
      assetId: 1,
      statusCode: 404
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
  })

  it('Abnormal system: Authentication error', async () => {
    s3Mock.on(HeadObjectCommand).resolves({
      ETag: '"AWSMockS3DownloadEtag"',
      Location: 'AWSMockS3DownloadLocation',
      key: 'AWSMockS3DownloadKey',
      Bucket: 'AWSMockS3DownloadBucket'
    })
    s3Mock.on(GetObjectCommand).resolves({
      Body: {
        transformToByteArray: () => {}
      }
    })

    const config = {
      server: fastify.server,
      siteId: ASSET_CONTENT_ID,
      assetId: ASSET_CONTENT_ID + '-1',
      statusCode: 401
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
  })
})
