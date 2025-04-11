// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * Build a fastify instance for testing
 *
 * @param {Object} options - Fastify options
 * @param {Object} options.logger - Logger instance
 * @returns {Object} A Fastify object
 * @module lib/test/build-fastify
 */
function buildFastify(options) {
  // Require the framework and instantiate it
  const fastify = require('fastify')({
    logger: options.logger,
    ajv: {
      customOptions: {
        coerceTypes: 'array'
      }
    }
  })

  fastify.register(require('../../app'), options)
  return fastify
}

module.exports = buildFastify
