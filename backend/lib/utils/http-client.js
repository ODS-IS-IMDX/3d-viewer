// Copyright (c) 2025 NTT InfraNet
'use strict'

const { Agent } = require('undici')
const crypto = require('node:crypto')
const { generateBoomObj } = require('../utils/generate-boom-obj')

const DISPATCH = process.env.NODE_ENV !== 'test'
const { LOG_ERROR } = require('../constants')

/**
 * HTTP Client
 * @param {Object} options
 * @param {String} [options.method] - HTTP method
 * @param {String} [options.baseUrl] - Base URL
 * @param {String} [options.path] - URL path
 * @param {Object} [options.queryParameters] - qauerystring parameters
 * @param {Object} [options.headers] - header parameters
 * @param {String|Function} [options.accessToken] - access token
 * @param {Object} [options.body] - body parameters / object
 * @param {Object} [options.isConverted] - convert the response
 * @param {Function} [options.getErrorMessageCode] - Get error message code
 * @returns {Promise} - response
 */
const httpClient = async ({
  method = 'GET',
  baseUrl,
  path = '',
  queryParameters = {},
  headers = {},
  accessToken,
  body,
  isConverted = true,
  getErrorMessageCode = null
}) => {
  const url = new URL(`${baseUrl}${path}`)
  const queryParams = Object.entries(queryParameters).reduce((pre, [k, v]) => {
    if (v !== undefined) {
      pre[k] = v
    }
    return pre
  }, {})

  if (queryParams && Object.keys(queryParams).length) {
    url.search = new URLSearchParams(queryParams)
  }

  if (body && !Object.keys(body).length) {
    body = undefined
  }

  if (accessToken) {
    switch (typeof accessToken) {
      case 'function':
        headers.Authorization = `Bearer ${await accessToken()}`
        break
      case 'string':
        headers.Authorization = `Bearer ${accessToken}`
        break
      default:
    }
  }

  // Measures for SSL renegotiation
  let dispatcher
  if (DISPATCH) {
    dispatcher = new Agent({
      connect: {
        rejectUnauthorized: false,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
      }
    })
  }

  return fetch(url.href, {
    method,
    headers,
    body,
    dispatcher
  }).then(async res => {
    const { status: statusCode, ok, statusText, headers: resHeaders } = res

    if (!ok) {
      const errorInfo = {
        statusCode,
        error: {
          error_code: statusText
        }
      }

      const contentType = (resHeaders.get('Content-Type') || '').toLowerCase()
      if (contentType.indexOf('application/json') >= 0) {
        const rJson = await res
          .json()
          .catch(e => console.log(LOG_ERROR + JSON.stringify(e)))
        if (rJson) {
          if (rJson.error_code) {
            errorInfo.error.error_code = rJson.error_code
          }
          const reqContentType = (headers['Content-Type'] || '').toLowerCase()
          console.log(
            LOG_ERROR +
              JSON.stringify({
                type: '[EXTERNAL-API-ERROR]',
                request: {
                  url: url.href,
                  method,
                  headers,
                  ...(reqContentType.indexOf('application/json') >= 0
                    ? { body }
                    : {})
                },
                response: {
                  statusCode,
                  error: rJson
                }
              })
          )
        }
      }

      throw generateBoomObj({
        errorInfo,
        getErrorMessageCode
      })
    }

    if (
      isConverted &&
      statusCode !== 204 &&
      (resHeaders.get('Content-Type') || '')
        .toLowerCase()
        .indexOf('application/json') >= 0
    ) {
      return {
        statusCode,
        data: await res.json()
      }
    }

    return {
      statusCode,
      data: res
    }
  })
}

module.exports = {
  httpClient
}
