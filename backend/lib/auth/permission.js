// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')
const { LOG_DEBUG } = require('../constants')

const ADMIN = '9999999999999-'

module.exports = fastify => async (req, res) => {
  const { id, corporationId } = req.user
  if (!id || !corporationId) {
    throw Boom.internal('unknown id')
  }

  // Administrators have access to all contents
  if (corporationId.startsWith(ADMIN)) return

  const { siteId } = req.params
  /* c8 ignore start */
  if (!corporationId || !siteId) {
    throw Boom.notFound('unknown resource id')
  }
  /* c8 ignore stop */

  const permission = await fastify.dbAdapters.sites
    .getPermission(siteId)
    .catch(e => {
      fastify.log.error(LOG_DEBUG + JSON.stringify(e))
      if (e.name === 'EntityNotFound') {
        throw Boom.notFound(e)
        /* c8 ignore start */
      } else {
        throw Boom.internal(e)
      }
      /* c8 ignore stop */
    })

  if (permission !== corporationId) {
    throw Boom.forbidden('access denied')
  }
}
