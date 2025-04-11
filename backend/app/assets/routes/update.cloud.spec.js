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
const { HEADER_KEY } = require('../../../lib/auth/constant')

describe('PUT `/sites/:siteId/assets/:assetId` Cloud', () => {
  const assertion = (config, response) => {
    const DateTypeKey = [
      'startDateTime',
      'endDateTime',
      'createdAt',
      'updatedAt',
      'deletedAt'
    ]
    Object.keys(config.body).forEach(key => {
      if (DateTypeKey.includes(key) && response.body.data.asset[key]) {
        t.deepEqual(
          response.body.data.asset[key],
          new Date(config.body[key]).toISOString()
        )
      } else {
        t.deepEqual(response.body.data.asset[key], config.body[key])
      }
    })
  }

  const api = async ({
    server,
    siteId,
    assetId,
    accessUserId,
    body = null,
    statusCode
  }) => {
    const url = `/sites/${siteId}/assets/${assetId}`
    return supertest(server)
      .put(url)
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
      'contents_resource_owners',
      'assets'
    ])
  })

  after(async done => {
    await fastify.close(done)
  })

  it('Normal system: Success', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      assetId: GENERAL_CONTENT_ID + '-1',
      body: {
        displayName: '単体テストLASファイル・更新データ',
        startDateTime: '2025-01-01T12:00:00.000',
        endDateTime: '2025-01-31T10:00:00.000',
        customPosition: {
          transform: [
            -0.7596848374009469,
            -0.6502914329922367,
            0,
            0,
            0.3617207131705919,
            -0.422570138906991,
            0.8310190150456755,
            0,
            -0.5404045461378495,
            0.6313125453220692,
            0.5562440081767311,
            0,
            -3450364.623906323,
            4030792.2806627946,
            3527721.0540310917,
            1
          ]
        }
      },
      statusCode: 200
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
    assertion(config, response)
  })

  it('Abnormal system: Authentication error', async () => {
    const db = await createClient()
    const beforeAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${GENERAL_CONTENT_ID + '-1'}`
    )

    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      assetId: GENERAL_CONTENT_ID + '-1',
      body: {
        displayName: '単体テストLASファイル・更新データ',
        startDateTime: '2025-01-01T12:00:00.000',
        endDateTime: '2025-01-31T10:00:00.000',
        customPosition: {
          transform: [
            -0.7596848374009469,
            -0.6502914329922367,
            0,
            0,
            0.3617207131705919,
            -0.422570138906991,
            0.8310190150456755,
            0,
            -0.5404045461378495,
            0.6313125453220692,
            0.5562440081767311,
            0,
            -3450364.623906323,
            4030792.2806627946,
            3527721.0540310917,
            1
          ]
        }
      },
      statusCode: 401
    }
    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)

    const latestAssets = await db.query(
      SQL`SELECT * FROM assets WHERE id = ${GENERAL_CONTENT_ID + '-1'}`
    )
    await db.end()
    t.deepEqual(latestAssets, beforeAssets)
  })

  it('Abnormal system: Non-existent assets', async () => {
    const config = {
      server: fastify.server,
      siteId: GENERAL_CONTENT_ID,
      accessUserId: GENERAL_USER_ID,
      assetId: 1,
      body: {
        displayName: '単体テストLASファイル・更新データ',
        startDateTime: '2025-01-01T12:00:00.000',
        endDateTime: '2025-01-31T10:00:00.000',
        customPosition: {
          transform: [
            -0.7596848374009469,
            -0.6502914329922367,
            0,
            0,
            0.3617207131705919,
            -0.422570138906991,
            0.8310190150456755,
            0,
            -0.5404045461378495,
            0.6313125453220692,
            0.5562440081767311,
            0,
            -3450364.623906323,
            4030792.2806627946,
            3527721.0540310917,
            1
          ]
        },
        customStyle: {
          test: 'カスタムスタイル'
        }
      },
      statusCode: 404
    }

    const response = await api(config)
    t.equal(response.statusCode, config.statusCode)
  })
})
