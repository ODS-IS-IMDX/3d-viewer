// Copyright (c) 2025 NTT InfraNet
'use strict'

const { getTotalPages, getPage, hasNext, hasPrev } = require('./pagination')

/**
 * Fastify Response Schemas
 * @module lib/http/responses
 */

/**
 * Generate a fastify schema for item responses
 *
 * @function getItemResponse
 * @param {Object} options
 * @param {String} options.type Item data type
 * @param {Object} options.data The data object
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const getItemResponse = ({ statusCode = 200, type, data }) => {
  return {
    statusCode,
    data: {
      description: 'The data of the response',
      [type]: data
    }
  }
}

/**
 * Generate a fastify schema for error responses
 *
 * @function getErrorResponseSchema
 * @param {Object} options
 * @param {String} options.description The error description
 * @param {Boolean} options.enableMessageCode
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const getErrorResponseSchema = ({ description, enableMessageCode = false }) => {
  const errorResponseSchem = {
    type: 'object',
    description,
    properties: {
      statusCode: { type: 'integer', description: 'The error code' },
      error: { type: 'string', description: 'The error short message' },
      message: { type: 'string', description: 'The error full message' }
    }
  }
  if (enableMessageCode) {
    errorResponseSchem.properties.messageCode = {
      type: 'string',
      description: 'The error message code'
    }
  }
  return errorResponseSchem
}

/**
 * Generate a fastify schema for item responses
 *
 * @function getItemResponseSchema
 * @param {Object} options
 * @param {String} options.type - Data type for properties
 * @param {Boolean} options.additionalProperties - Allow additional properties, default false.
 * @param {Object} options.itemSchema - The item schema
 * @param {String} options.description The schema description
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const getItemResponseSchema = ({
  type,
  itemSchema,
  additionalProperties = false,
  description = '',
  examples,
  required
}) => {
  return {
    description,
    type: 'object',
    additionalProperties: false,
    properties: {
      statusCode: {
        description: 'HTTP status code of the response',
        type: 'integer',
        examples: [200]
      },
      data: {
        type: 'object',
        description: 'The data of the response',
        properties: {
          [type]: {
            type: 'object',
            description: `The data of the ${type}`,
            properties: itemSchema,
            required,
            examples,
            additionalProperties
          }
        }
      }
    }
  }
}

/**
 * Generate a fastify schema for item array responses
 *
 * @function getItemArrayResponseSchema
 * @param {Object} options
 * @param {Object} options.itemSchema - The item schema
 * @param {Boolean} options.additionalProperties - Allow additional properties, default false.
 * @param {String} options.description The schema description
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const getItemArrayResponseSchema = ({
  itemSchema,
  additionalProperties = false,
  description = ''
}) => {
  return {
    description,
    type: 'object',
    additionalProperties: false,
    properties: {
      statusCode: {
        type: 'integer',
        description: 'HTTP status code of the response'
      },
      data: {
        type: 'array',
        description: 'Data of the response',
        items: {
          type: 'object',
          description: 'Items data',
          additionalProperties,
          properties: itemSchema
        }
      }
    }
  }
}

/**
 * Generate a fastify schema for a collection response
 *
 * @function getCollectionResponse
 * @param {Object} options
 * @param {Object} options.current - The current page
 * @param {Object} options.next - Next page link
 * @param {Object} options.prev - Prev page link
 * @param {Object} options.totalItems - Total item count
 * @param {Object} options.limit - Item limit
 * @param {Object} options.offset - Items offset
 * @param {Object} options.totalPages - Total pages
 * @param {Object} options.page - Current page
 * @param {Object} options.customProperties - Custom properties
 * @param {Object} options.items - The item array
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const getCollectionResponse = ({
  current,
  next,
  prev,
  totalItems,
  limit,
  offset,
  totalPages,
  page,
  customProperties = {},
  items
}) => {
  return {
    statusCode: 200,
    data: {
      current,
      next,
      prev,
      totalItems,
      limit,
      offset,
      totalPages,
      page,
      ...customProperties,
      items
    }
  }
}

const _getHref = (cURL, offset) => {
  const url = new URL(cURL)
  url.searchParams.set('offset', offset)
  return url.href
}

/**
 * Generate a fastify schema for a collection response (wrapper)
 *
 * @function generateCollectionResponse
 * @param {Object} options
 * @param {Object} options.totalItems - Total item count
 * @param {Object} options.href - The current page href
 * @param {Object} options.limit - Item limit
 * @param {Object} options.offset - Items offset
 * @param {Object} options.customProperties - Custom properties
 * @param {Object} options.items - The item array
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const generateCollectionResponse = ({
  totalItems,
  href,
  limit,
  offset,
  customProperties,
  items
}) => {
  return getCollectionResponse({
    totalItems,
    current: href,
    next: hasNext(offset, limit, totalItems)
      ? _getHref(href, offset + limit)
      : null,
    prev: hasPrev(offset, limit)
      ? _getHref(href, Math.max(offset - limit, 0))
      : null,
    limit,
    offset,
    page: getPage(Math.min(offset, totalItems), limit),
    totalPages: getTotalPages(totalItems, limit),
    customProperties,
    items
  })
}

/**
 * Generate a fastify schema for a paginated collection response
 *
 * @function getCollectionResponseSchema
 * @param {Object} options
 * @param {Object} options.itemSchema - The item schema
 * @param {Object} options.description - Schema description
 * @param {Object} options.examples - Schema examples
 * @param {Object} options.customProperties - Schema properties
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const getCollectionResponseSchema = ({
  itemSchema,
  description,
  examples,
  customProperties = {}
}) => {
  return {
    description,
    type: 'object',
    additionalProperties: false,
    properties: {
      statusCode: {
        type: 'integer',
        description: 'HTTP status code of the response',
        examples: [200]
      },
      data: {
        type: 'object',
        properties: {
          current: {
            description:
              'References this page. Useful for refreshing the current listing',
            type: 'string'
          },
          next: {
            description:
              'References the next page in the sequence. Undefined if there is none',
            type: 'string',
            nullable: true
          },
          prev: {
            description:
              'References the previous page in the sequence. Undefined if there is none',
            type: 'string',
            nullable: true
          },
          totalItems: {
            description: 'The total number of items across all pages',
            type: 'integer',
            minimum: 0,
            examples: [1]
          },
          limit: {
            description: 'The max number of items within a single page',
            type: 'integer',
            minimum: 1,
            examples: [20]
          },
          offset: {
            description: 'The numeric offset of the first item in the page',
            type: 'integer',
            minimum: 0
          },
          totalPages: {
            description: 'The total number of pages',
            type: 'integer',
            minimum: 0,
            examples: [1]
          },
          page: {
            description: 'The current page number',
            type: 'integer',
            minimum: 0
          },
          ...customProperties,
          items: {
            type: 'array',
            description: 'The items',
            items: itemSchema
          }
        },
        examples
      }
    }
  }
}

/**
 * Generate a fastify schema for error response set
 *
 * @function getErrorResponseSetSchema
 * @param {Object} options
 * @param {String} options.statusCodeList The error status code list
 * @param {Boolean} options.customSchema The custom error schema
 * @returns {Object} A fastify schema
 * @memberof lib/http/responses
 */
const getErrorResponseSetSchema = ({
  statusCodeList = [],
  customSchema = {}
} = {}) => {
  let result = {}
  const commonErrorSchema = {
    400: getErrorResponseSchema({
      description: 'Bad request error'
    }),
    401: getErrorResponseSchema({
      description: 'Unauthorized error'
    }),
    403: getErrorResponseSchema({
      description: 'Permission required'
    }),
    404: getErrorResponseSchema({
      description: 'Not found'
    }),
    409: getErrorResponseSchema({
      description: 'Conflict error'
    }),
    500: getErrorResponseSchema({
      description: 'Generic error'
    }),
    503: getErrorResponseSchema({
      description: 'Service Unavailable error'
    })
  }
  if (statusCodeList.length) {
    statusCodeList.forEach(statusCode => {
      result[statusCode] =
        customSchema[statusCode] || commonErrorSchema[statusCode]
    })
  } else {
    result = {
      ...commonErrorSchema,
      ...customSchema
    }
  }
  return result
}

module.exports = {
  getItemResponse,
  getItemResponseSchema,
  getItemArrayResponseSchema,
  getCollectionResponse,
  getCollectionResponseSchema,
  generateCollectionResponse,
  getErrorResponseSchema,
  getErrorResponseSetSchema
}
