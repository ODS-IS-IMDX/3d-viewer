// Copyright (c) 2025 NTT InfraNet
'use strict'

require('tap')
const t = require('assert').strict
const supertest = require('supertest')
const buildFastify = require('../lib/test/build-fastify')

describe('GET `/` route', () => {
  let fastify

  before(async () => {
    fastify = buildFastify({ dbAdapter: 'none' })
    await fastify.ready()
  })

  after(async () => {
    await fastify.close()
  })

  it('should return OK', async () => {
    const response = await supertest(fastify.server)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
    t.deepEqual(response.body, { status: 'OK', platform: 'none' })
  })
})
