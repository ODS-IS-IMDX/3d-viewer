// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const supertest = require('supertest')

const buildFastify = require('../../../lib/test/build-fastify')
const { resetDb } = require('../../../lib/test/cloud')

const api = async ({ server, statusCode }) => {
  const url = `/liveness`
  return supertest(server)
    .get(url)
    .query("")
    .expect(statusCode)
    .expect('Content-Type', 'application/json; charset=utf-8')
}

describe('GET `/liveness` Cloud', () => {
  let fastify

  before(async () => {
    await resetDb(['users'])

    fastify = buildFastify({ dbAdapter: 'cloud' })
    await fastify.ready()
  })

  after(async done => {
    await fastify.close(done)
  })

  it('Normal system', async () => {
    const config = {
      server: fastify.server,
      statusCode: 200
    }

    await api(config)
  })

  it('Abnormal system: (500)Generic error', async () => {
    await resetDb()

    const config = {
      server: fastify.server,
      statusCode: 500
    }

    await api(config)
  })
})
