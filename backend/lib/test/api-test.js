// Copyright (c) 2025 NTT InfraNet
/**
 * verifySiteAuthorityテスト用API
 */
async function verifySiteAuthorityTestApi(fastify) {
  fastify.get(
    '/:siteId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            siteId: { type: 'string' }
          }
        }
      },
      preHandler: [fastify.authorize]
    },
    async (req, res) => {
      res.send({
        statusCode: 200,
        testResult: 'ok'
      })
    }
  )
}

async function routes(fastify) {
  fastify.register(verifySiteAuthorityTestApi)
}

module.exports = routes
