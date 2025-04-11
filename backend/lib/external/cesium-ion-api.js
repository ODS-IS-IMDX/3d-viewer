// Copyright (c) 2025 NTT InfraNet
'use strict'

const { httpClient } = require('../utils/http-client')
const { fetch } = require('undici')

// Cesium World Terrain -> 1
const DEFAULT_ASSET_IDS = [1]
const DEFAULT_ASSET_SCOPES = ['assets:read', 'assets:write']
const STATUS = {
  /**
   * CesiumIon conversion status: Data upload waiting
   */
  AWAITING_FILES: 'AWAITING_FILES',
  /**
   * CesiumIon conversion status: Waiting for conversion
   */
  NOT_STARTED: 'NOT_STARTED',
  /**
   * CesiumIon conversion state: Conversion in progress
   */
  IN_PROGRESS: 'IN_PROGRESS',
  /**
   * CesiumIon conversion status: Conversion completed
   */
  COMPLETE: 'COMPLETE',
  /**
   * CesiumIon conversion status: data error
   */
  DATA_ERROR: 'DATA_ERROR',
  /**
   * CesiumIon conversion status: internal error
   */
  ERROR: 'ERROR'
}

const generateArrayParams = (baseArray, addList) => {
  return Array.from(
    new Set(baseArray.concat(Array.isArray(addList) ? addList : []))
  )
}

/**
 * Cesium ion REST API
 * @module lib/external/cesium-ion-api
 */

/**
 * Tokens - Create a new token
 *
 * @param {Object} options
 * @param {String} options.baseUrl - Base url
 * @param {String} options.accessToken - Access token
 * @param {String} options.name - Token name
 * @param {Array} options.assetIds - List of asset IDs
 * @param {Array} options.scopes - Scope list
 * @param {Array} options.allowedUrls - List of permission URLs
 * @param {Function} options.getErrorMessageCode - Get error message code
 * @returns {Promise}
 * @memberof lib/external/cesium-ion-api
 */
const createToken = async ({
  baseUrl,
  accessToken,
  name,
  assetIds = undefined,
  scopes = undefined,
  allowedUrls = undefined,
  getErrorMessageCode = undefined
}) => {
  const { data } = await httpClient({
    method: 'POST',
    baseUrl,
    path: `/v2/tokens`,
    body: JSON.stringify({
      name,
      assetIds: generateArrayParams(DEFAULT_ASSET_IDS, assetIds),
      scopes: generateArrayParams(DEFAULT_ASSET_SCOPES, scopes),
      allowedUrls
    }),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8;'
    },
    accessToken,
    getErrorMessageCode
  })

  return data
}

/**
 * Tokens - Get info about a token
 *
 * @param {Object} options
 * @param {String} options.baseUrl - Base url
 * @param {String} options.accessToken - Access token
 * @param {String} options.tokenId - Token ID
 * @param {Function} options.getErrorMessageCode - Get error message code
 * @returns {Promise}
 * @memberof lib/external/cesium-ion-api
 */
const getToken = async ({
  baseUrl,
  accessToken,
  tokenId,
  getErrorMessageCode = undefined
}) => {
  const { data } = await httpClient({
    method: 'GET',
    baseUrl,
    path: `/v2/tokens/${tokenId}`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8;'
    },
    accessToken,
    getErrorMessageCode
  })

  return data
}

/**
 * Tokens - Modify token info
 *
 * @param {Object} options
 * @param {String} options.baseUrl - Base url
 * @param {String} options.accessToken - Access token
 * @param {String} options.tokenId - Token ID
 * @param {String} options.name - Token name
 * @param {Array} options.assetIds - List of asset IDs
 * @param {Array} options.scopes - Scope list
 * @param {Array} options.allowedUrls - List of permission URLs
 * @param {Function} options.getErrorMessageCode - Get error message code
 * @returns {Promise}
 * @memberof lib/external/cesium-ion-api
 */
const modifyToken = async ({
  baseUrl,
  accessToken,
  tokenId,
  name = undefined,
  assetIds = undefined,
  scopes = undefined,
  allowedUrls = undefined,
  getErrorMessageCode = undefined
}) => {
  const { data } = await httpClient({
    method: 'PATCH',
    baseUrl,
    path: `/v2/tokens/${tokenId}`,
    body: JSON.stringify({
      name,
      assetIds: generateArrayParams(DEFAULT_ASSET_IDS, assetIds),
      scopes: generateArrayParams(DEFAULT_ASSET_SCOPES, scopes),
      allowedUrls
    }),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8;'
    },
    accessToken,
    getErrorMessageCode
  })

  return data
}

/**
 * Tokens - Delete a token
 *
 * @param {Object} options
 * @param {String} options.baseUrl - Base url
 * @param {String} options.accessToken - Access token
 * @param {String} options.tokenId - Token ID
 * @param {Function} options.getErrorMessageCode - Get error message code
 * @returns {Promise}
 * @memberof lib/external/cesium-ion-api
 */
const deleteToken = async ({
  baseUrl,
  accessToken,
  tokenId,
  getErrorMessageCode = undefined
}) => {
  const { data } = await httpClient({
    method: 'DELETE',
    baseUrl,
    path: `/v2/tokens/${tokenId}`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8;'
    },
    accessToken,
    getErrorMessageCode
  })

  return data
}

/**
 * Generate the token if it does not exist
 *
 * @param {Object} options
 * @param {String} options.baseUrl - Base url
 * @param {String} options.accessToken - Access token
 * @param {String} options.tokenId - Token ID
 * @param {String} options.name - Token name
 * @param {Array} options.assetIds - List of asset IDs
 * @param {Function} options.getErrorMessageCode - Get error message code
 * @returns {Promise}
 * @memberof lib/external/cesium-ion-api
 */
const generateToken = async ({
  baseUrl,
  accessToken,
  tokenId,
  name,
  assetIds,
  getErrorMessageCode
}) => {
  let ionToken =
    tokenId &&
    (await getToken({
      baseUrl,
      accessToken,
      tokenId,
      getErrorMessageCode
    }).catch(e => {
      if (e.output.statusCode !== 404) {
        throw e
      }
    }))

  if (
    ionToken &&
    !DEFAULT_ASSET_IDS.every(id => ionToken.assetIds.includes(id))
  ) {
    await modifyToken({
      baseUrl,
      accessToken,
      tokenId,
      assetIds: generateArrayParams(DEFAULT_ASSET_IDS, assetIds),
      getErrorMessageCode
    })

    ionToken = await getToken({
      baseUrl,
      accessToken,
      tokenId,
      getErrorMessageCode
    }).catch(e => {
      if (e.output.statusCode !== 404) {
        throw e
      }
    })
  }

  if (!ionToken) {
    ionToken = await createToken({
      baseUrl,
      accessToken,
      name,
      assetIds,
      getErrorMessageCode
    })
  }

  return ionToken
}

/**
 * Generate request headers
 * @returns Object
 */
const generateHeader = fastify => {
  if (fastify.config.asset.cesiumIon.token) {
    return {
      Authorization: `Bearer ${fastify.config.asset.cesiumIon.token}`,
      'Content-Type': 'application/json'
    }
  }

  return {
    'Content-Type': 'application/json'
  }
}

/**
 * Make a request from CesiumIon.
 * If you want to move it with a mock, also specify a mockFunction.
 *
 * @param {Object} fastify Fastify instance object
 * @param {string} method CesiumIonAPI Methods
 * @param {string} path CesiumIonAPI path
 * @param {string} body JSON string to set in the request body
 */
const request = async (fastify, method, path, body) => {
  const option = {
    method,
    headers: generateHeader(fastify),
    body
  }

  return fetch(fastify.config.asset.cesiumIon.host + path, option)
}

/**
 * Request to the Asset Creation API
 *
 * @param {Object} fastify Fastify instance
 * @param {string} body JSON text column
 * @returns {Object}
 */
const createAsset = async (fastify, body) => {
  const apiPath = '/v1/assets'
  return request(fastify, 'POST', apiPath, body)
}

/**
 * Asset Information API Request
 *
 * @param {Object} fastify Fastify instance
 * @param {string} assetId CesiumIon Asset ID
 * @returns
 */
const getAssetInfo = async (fastify, assetId) => {
  const apiPath = '/v1/assets/' + encodeURIComponent(assetId)
  return request(fastify, 'GET', apiPath)
}

/**
 * Asset Delete API Request
 *
 * @param {Object} fastify Fastify instance
 * @param {string} assetId CesiumIon Asset ID
 * @returns
 */
const deleteAsset = async (fastify, assetId) => {
  const apiPath = '/v1/assets/' + encodeURIComponent(assetId)
  return request(fastify, 'DELETE', apiPath)
}

module.exports = {
  DEFAULT_ASSET_IDS,
  DEFAULT_ASSET_SCOPES,
  STATUS,
  createToken,
  getToken,
  modifyToken,
  deleteToken,
  generateToken,
  generateHeader,
  request,
  createAsset,
  getAssetInfo,
  deleteAsset
}
