// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')

const buildFastify = require('../../../lib/test/build-fastify')
const { getToken, getUserToken } = require('../../../lib/test/auth')
const { resetDb } = require('../../../lib/test/cloud')
const { HEADER_KEY } = require('../../../lib/auth/constant')

const api = async ({
  server,
  accessUserId = 'user-0000-0000-0000-general',
  accessToken = null,
  query = null,
  statusCode
}) => {
  const url = `/users/profile`
  return supertest(server)
    .get(url)
    .set(
      HEADER_KEY,
      accessToken || (accessUserId ? await getUserToken(accessUserId) : '')
    )
    .query(query)
    .expect(statusCode)
    .expect('Content-Type', 'application/json; charset=utf-8')
}

describe('GET `/users/profile` Cloud', () => {
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
      statusCode: 401
    }

    const response = await api(config)

    t.equal(response.body.statusCode, config.statusCode)
    t.equal(response.body.error, 'Unauthorized')
    t.equal(response.body.message, 'Login required')
  })

  it('Normal system: New users', async () => {
    const config = {
      server: fastify.server,
      accessUserId: 'test-user-001',
      statusCode: 200
    }

    const response = await api(config)

    const actual = response.body.data.user
    t.deepEqual(actual, {
      id: config.accessUserId,
      language: 'en',
      name: '',
      phone_number: null,
      corporation: {
        id: '9000000000001-01',
        name: '共通企業01'
      },
      email: 'general@example.com',
      family_name: '',
      given_name: '',
      site: {
        id: 'content-9999-9999-0001-general',
        name: '共通コンテンツ01'
      }
    })
  })

  it('Normal system: Existing user', async () => {
    const config = {
      server: fastify.server,
      accessUserId: 'user-9999-9999-0001-general',
      statusCode: 200
    }

    const response = await api(config)

    const actual = response.body.data.user
    t.deepEqual(actual, {
      id: config.accessUserId,
      language: 'ja',
      name: '共通 ユーザー',
      phone_number: '+123 1234566',
      corporation: {
        id: '9000000000001-01',
        name: '共通企業01'
      },
      email: 'general@example.com',
      family_name: '共通',
      given_name: 'ユーザー',
      site: {
        id: 'content-9999-9999-0001-general',
        name: '共通コンテンツ01'
      }
    })
  })

  it('Normal system: Update user', async () => {
    const config = {
      server: fastify.server,
      accessToken: getToken({
        iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com',
        sub: 'user-0000-0000-0000-general',
        'custom:infra_company_id': 'corporation-0000-0000-0000-general',
        email: 'update@example.com',
        iat: 1555195955,
        exp: 1800000000
      }),
      statusCode: 200
    }

    const response = await api(config)

    const actual = response.body.data.user
    t.deepEqual(actual, {
      id: 'user-0000-0000-0000-general',
      language: 'ja',
      name: 'ユーザー 共通',
      phone_number: '+123 1234566',
      corporation: {
        id: 'corporation-0000-0000-0000-general',
        name: '共通企業'
      },
      email: 'update@example.com',
      family_name: 'ユーザー',
      given_name: '共通',
      site: {
        id: 'content-0000-0000-0000-general',
        name: '共通コンテンツ'
      }
    })
  })

  it('Exception system:authorize invalid token', async () => {
    const config = {
      server: fastify.server,
      accessToken: getToken({
        iss: 'unknown-iss',
        sub: 'user-0000-0000-0000-general',
        'custom:infra_company_id': 'corporation-0000-0000-0000-general',
        email: 'update@example.com',
        iat: 1555195955,
        exp: 1800000000
      }),
      statusCode: 401
    }

    const response = await api(config)

    t.deepEqual(response.body, {
      statusCode: config.statusCode,
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('Exception system: authorize without token expire', async () => {
    const config = {
      server: fastify.server,
      accessToken: getToken({
        iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com',
        sub: 'user-0000-0000-0000-general',
        'custom:infra_company_id': 'corporation-0000-0000-0000-general',
        email: 'update@example.com',
        iat: 1555195955
      }),
      statusCode: 401
    }

    const response = await api(config)

    t.deepEqual(response.body, {
      statusCode: config.statusCode,
      error: 'Unauthorized',
      message: 'Token expired'
    })
  })

  it('Exception system: authorize token expired', async () => {
    const config = {
      server: fastify.server,
      accessToken: getToken({
        iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com',
        sub: 'user-0000-0000-0000-general',
        'custom:infra_company_id': 'corporation-0000-0000-0000-general',
        email: 'update@example.com',
        iat: 1555195955,
        exp: 1555200000
      }),
      statusCode: 401
    }

    const response = await api(config)

    t.deepEqual(response.body, {
      statusCode: config.statusCode,
      error: 'Unauthorized',
      message: 'Token expired'
    })
  })

  it('Exception system: (500)Generic error', async () => {
    await resetDb()

    const config = {
      server: fastify.server,
      siteId: '00000000-0000-0000-0000-000000000000',
      statusCode: 500
    }

    await api(config)
  })
})
