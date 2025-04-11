// Copyright (c) 2025 NTT InfraNet
'use strict'

const parameterSchemas = require('../../app/schema')
const commonSchemas = require('../common-schema-types')
const cloneDeep = require('lodash/cloneDeep')
const isArray = require('lodash/isArray')

/**
 * OpenAPI v3 Schema Generator
 *
 * @class OpenAPISchema
 * @param {Object} options - An Object containing the config
 * @param {Object} options.swagger - The swagger configuration
 */
class OpenAPISchema {
  constructor(options) {
    this.excludePaths = [
      '/documentation',
      '/documentation/json',
      '/documentation/yaml',
      '/documentation/*',
      '/api/definition/json',
      '/api/definition/markdown',
      '/documentation/uiConfig',
      '/documentation/initOAuth',
      '/documentation/static/*',
      '/:siteId'
    ]

    this.schemaObjectList = [...parameterSchemas(), ...commonSchemas()]

    this.schema = {
      openapi: '3.0.0',
      info: options.swagger.info,
      servers: [
        {
          url: 'http://localhost:3000/'
        }
      ],
      paths: {},
      components: {
        schemas: {}
      },
      security: [],
      tags: [],
      externalDocs: options.swagger.externalDocs
    }
  }

  /**
   * Look up common schema types by id
   *
   * @param {Object} options
   * @param {String} options.id - The schema identifier
   * @returns {Object} A schema object
   * @memberof OpenAPISchema
   */
  lookupSchema(id) {
    const schemaObject = this.schemaObjectList.find(item => item.$id === id)
    return Object.assign({}, schemaObject, { $id: undefined })
  }

  /**
   * Generate a request query parameter operation for the schema
   *
   * @param {Object} options
   * @param {String} options.schema - The schema from a fastify route
   * @param {String} options.url - The fastify route url
   * @returns {Object} A request query parameter operation schema object
   * @memberof OpenAPISchema
   */
  makeRequestQueryParameters(schema) {
    const names = []

    schema.querystring &&
      names.push(...Object.keys(schema.querystring.properties))

    let requiredArray = []
    if (
      schema.querystring &&
      schema.querystring.required &&
      isArray(schema.querystring.required)
    ) {
      requiredArray = schema.querystring.required
    }
    return names.map(name => {
      let schemaObject

      schemaObject = schema.querystring.properties[name]
      if (typeof schemaObject === 'string') {
        schemaObject = this.lookupSchema(name)
      }

      return {
        name: name.toString(),
        in: 'query',
        description: '',
        required: requiredArray.includes(name.toString()),
        schema: schemaObject
      }
    })
  }

  /**
   * Generate a request path parameter operation for the schema
   *
   * @param {Object} options
   * @param {String} options.schema - The schema from a fastify route
   * @param {String} options.url - The fastify route url
   * @returns {Object} A request path parameter operation schema object
   * @memberof OpenAPISchema
   */
  makeRequestPathParameters(params) {
    const names = []

    names.push(...Object.keys(params.properties))
    return names.map(name => {
      let schemaObject
      if (params.properties[name]) {
        schemaObject = params.properties[name]
      }

      if (typeof schemaObject === 'string') {
        schemaObject = this.lookupSchema(name)
      }

      return {
        name: name.toString(),
        in: 'path',
        description: '',
        // required: schemaObject.isRequired == false ? false : true,
        required: true,
        schema: schemaObject
      }
    })
  }

  /**
   * Generate a request body operation for the schema
   *
   * @param {Object} options
   * @param {String} options.schema - The schema from a fastify route
   * @returns {Object} A request body schema object
   * @memberof OpenAPISchema
   */
  makeRequestBody({ schema }) {
    const {
      body: { properties, required }
    } = schema
    const type = 'object'

    const schemaOut = { properties, type }
    if (required && required.length) {
      schemaOut.required = schema.body.required
    }

    return {
      content: {
        'application/json': { schema: schemaOut }
      }
    }
  }

  /**
   * Add a fastify route schema
   *
   * @param {Object} options
   * @param {String} options.method - The route method
   * @param {String} options.schema - The schema from a fastify route
   * @param {String} options.url - The route url
   * @memberof OpenAPISchema
   */
  addRouteSchema({ method, schema, url }) {
    if (!schema) return
    if (method === 'HEAD') return

    if (this.excludePaths.includes(url)) return
    url = url.replace(/:(\w+)/g, '{$1}')

    const {
      deprecated = false,
      summary = '',
      tags = [],
      description = '',
      operationId = ''
    } = schema

    const operation = {
      tags,
      summary,
      description,
      operationId,
      responses: {},
      security: [],
      deprecated
    }

    // Add request parameters
    let pathParams
    if (schema.querystring) {
      operation.parameters = this.makeRequestQueryParameters(schema)
    }
    if (schema.params) {
      // path Params
      pathParams = this.makeRequestPathParameters(schema.params)
    }

    // Add request body
    if (schema.body && schema.body.properties) {
      operation.requestBody = this.makeRequestBody({ schema })
    }

    // Add responses
    if (schema.response) {
      const statusCodes = Object.keys(schema.response)
      statusCodes.forEach(status => {
        operation.responses[status] = {
          description: schema.response[status].description || ''
        }

        if (!['204', '304'].includes(status)) {
          operation.responses[status].content = {
            'application/json': {
              schema: schema.response[status]
            }
          }
        }
      })
    }

    // Populate the paths object
    if (!this.schema.paths[url]) {
      this.schema.paths[url] = {
        // path Paramsを外に出す
        parameters: pathParams,
        [method.toLowerCase()]: operation
      }
    } else {
      this.schema.paths[url][method.toLowerCase()] = operation
    }
    this.schema = cloneDeep(this.schema)
  }

  /**
   * Get a copy of the schema as currently defined.
   *
   * @returns {Object} The OpenAPI Schema Object
   * @memberof OpenAPISchema
   */
  generate() {
    return this.schema
  }
}

module.exports = OpenAPISchema
