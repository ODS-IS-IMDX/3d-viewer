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
const { ASSET_STATUS } = require('../constants')
const config = require('../../../config')
const { nock } = require('../../../lib/test/nock')
const { HEADER_KEY } = require('../../../lib/auth/constant')

describe('DELETE `/sites/:siteId/assets/:assetId` Cloud', () => {
  const api = async ({ server, siteId, accessUserId, assetId }) => {
    const url = `/sites/${siteId}/assets/${assetId}`
    return supertest(server)
      .delete(url)
      .set(
        HEADER_KEY,
        accessUserId ? await getUserToken(accessUserId) : 'xxxxxxxxxxxxxxx'
      )
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

  it('Normal system: Success (space ID is not available)', async () => {
    await resetDb([
      'corporations',
      'users',
      'contents',
      'contents_resource_owners',
      'assets'
    ])

    let db = await createClient()
    const contents = await db.query(
      SQL`SELECT * FROM contents WHERE id = ${GENERAL_CONTENT_ID}`
    )
    await db.end()
    nock
      .patch(
        cfg.asset.cesiumIon.host,
        `/v2/tokens/${contents[0][0].cesiumIonTokenId}`
      )
      .reply(204)

    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      assetId: GENERAL_CONTENT_ID + '-1',
      statusCode: 204,
      expected: {
        status: ASSET_STATUS.DELETE_WAIT
      }
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${config.assetId}`
    )
    await db.end()
    t.equal(latestAssets[0].length, 1)

    Object.keys(config.expected).forEach(key => {
      t.equal(latestAssets[0][0][key], config.expected[key])
    })
  })

  it('Abnormal system: Authentication error', async () => {
    await resetDb([
      'corporations',
      'users',
      'contents',
      'contents_resource_owners',
      'assets'
    ])

    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      assetId: 1,
      statusCode: 401
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE deletedAt IS NOT NULL`
    )
    await db.end()
    t.equal(latestAssets[0].length, 0)
  })

  it('Abnormal: Non-existent company ID', async () => {
    await resetDb(['users', 'contents', 'contents_resource_owners', 'assets'])

    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      assetId: 1,
      statusCode: 404
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE deletedAt IS NOT NULL`
    )
    await db.end()
    t.equal(latestAssets[0].length, 0)
  })

  it('Abnormal: Non-existent users', async () => {
    await resetDb([
      'corporations',
      'contents',
      'contents_resource_owners',
      'assets'
    ])

    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      assetId: 1,
      statusCode: 404
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE deletedAt IS NOT NULL`
    )
    await db.end()
    t.equal(latestAssets[0].length, 0)
  })

  it('Abnormal system: Non-existent assets', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      assetId: 1,
      statusCode: 404
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const db = await createClient()
    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE deletedAt IS NOT NULL`
    )
    await db.end()
    t.equal(latestAssets[0].length, 0)
  })
})
