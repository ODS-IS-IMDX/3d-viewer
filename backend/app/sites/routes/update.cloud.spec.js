// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')

const buildFastify = require('../../../lib/test/build-fastify')
const { getUserToken } = require('../../../lib/test/auth')
const { resetDb } = require('../../../lib/test/cloud')
const { HEADER_KEY } = require('../../../lib/auth/constant')

const api = async ({
  server,
  accessUserId = 'user-0000-0000-0000-general',
  siteId,
  body,
  statusCode
}) => {
  const url = `/sites/${siteId}`
  return supertest(server)
    .put(url)
    .set(
      HEADER_KEY,
      accessUserId ? await getUserToken(accessUserId) : ''
    )
    .send(body)
    .expect(statusCode)
    .expect('Content-Type', 'application/json; charset=utf-8')
}

describe('PUT `/sites/:siteId` Cloud', () => {
  let fastify

  before(async () => {
    await resetDb(['corporations', 'users', 'contents'])

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
      siteId: 'content-0000-0000-0000-update000',
      body: {
        externalServiceAuth: {
          type: 'ELMO',
          operation: 'SET',
          params: {
            username: 'username',
            password: 'password'
          }
        }
      },
      statusCode: 401
    }

    const response = await api(config)

    t.equal(response.body.statusCode, config.statusCode)
    t.equal(response.body.error, 'Unauthorized')
    t.equal(response.body.message, 'Login required')
  })

  it('Abnormal system (400): No siteId registration', async () => {
    const config = {
      server: fastify.server,
      siteId: 'content-0000-0000-0000-update000',
      body: {
        externalServiceAuth: {
          type: 'ELMO',
          operation: 'SET',
          params: {
            username: 'username',
            password: 'password'
          }
        }
      },
      statusCode: 404
    }

    const response = await api(config)

    t.deepEqual(response.body, {
      statusCode: config.statusCode,
      error: 'Not Found',
      message: 'Cannot find site with id content-0000-0000-0000-update000'
    })
  })

  it('Abnormal system (500): Generic error', async () => {
    await resetDb()

    const config = {
      server: fastify.server,
      siteId: 'content-0000-0000-0000-update002',
      body: {},
      statusCode: 500
    }

    await api(config)
  })
})
