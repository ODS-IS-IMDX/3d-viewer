// Copyright (c) 2025 NTT InfraNet
'use strict'
const _pick = require('lodash/pick')
const { DEFAULT_PAGE_SIZE } = require('./constants')

/**
 * Fastify Request Schemas
 * @module lib/http/requests
 */

/**
 * Generate a fastify schema for item requests
 *
 * @function getItemRequestParamsSchema
 * @param {Object} options
 * @param {Object} options.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof lib/http/requests
 */
const getItemRequestParamsSchema = (options = {}) => {
  const { allowed } = options
  const schema = {
    showdeleted: {
      type: 'boolean',
      description:
        'If set to true and the user is authorized, returns the element even if was deleted'
    },
    permissions: {
      type: 'boolean',
      description: 'Check permissions without executing the route handler'
    },
    version: {
      description: 'A version number for revision based entities',
      type: 'integer'
    }
  }

  return _pick(schema, allowed)
}

/**
 * Generate a fastify schema for collection requests
 *
 * @function getCollectionRequestParamsSchema
 * @param {Object} options
 * @param {Object} options.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof lib/http/requests
 */
const getCollectionRequestParamsSchema = (options = {}) => {
  const { allowedSortValues, allowedLimitValues, pageSize, allowed } = options
  const schema = {
    created: {
      description:
        'An ISO8601 date. When used, results will only include entries whose createdAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    updated: {
      description:
        'An ISO8601 date. When used, results will only include entries whose updatedAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    deleted: {
      description:
        'An ISO8601 date. When used, results will only include entries whose deletedAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    offset: {
      description:
        'Given a collection of results, the numeric offset (inclusive) of the first item to return',
      type: 'integer',
      minimum: 0
    },
    limit: {
      description: 'The total number of entries to include in a given response',
      type: 'integer',
      minimum: 1,
      maximum: allowedLimitValues || pageSize || DEFAULT_PAGE_SIZE
    },
    sort: {
      description: 'A string containing the sort attribute (e.g. name)',
      type: 'string',
      enum: allowedSortValues
    },
    direction: {
      description: 'The sort direction',
      type: 'string',
      enum: ['ASC', 'DESC']
    },
    filter: {
      description:
        'A string to filter the results, every API define which attributes are used to apply the filter',
      type: 'string'
    },
    showdeleted: {
      type: 'boolean',
      description:
        'If set to true and the user is authorized, returns the element even if was deleted'
    }
  }

  return _pick(schema, allowed)
}

module.exports = {
  getItemRequestParamsSchema,
  getCollectionRequestParamsSchema
}
