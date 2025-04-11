// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')

async function get(fastify) {
  fastify.get('', async () => {
    try {
      return await fastify.dbAdapters.liveness.noOpDb()
    } catch (e) {
      throw Boom.boomify(e, { statusCode: 500 })
    }
  })
}

module.exports = get
