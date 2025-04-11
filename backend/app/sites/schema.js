// Copyright (c) 2025 NTT InfraNet
'use strict'
/**
 * Fastify schema for User accounts
 * @module app/sites/schema
 */
const _pick = require('lodash/pick')

const viewStructure = {
  description: 'Drawing data structure',
  type: 'object',
  additionalProperties: true,
  examples: [
    {
      elements: [
        {
          name: 'test1',
          displayName: 'test1',
          isDirectory: true,
          expanded: true,
          nodeID: 1,
          children: [
            {
              name: 'アセット',
              displayName: 'アセット',
              isDirectory: true,
              expanded: true,
              nodeID: 2,
              children: [
                {
                  name: 'asset-01.las',
                  displayName: 'asset-01.las',
                  status: 'CONVERTING',
                  referenceId: 'asset-01',
                  ehvAssetType: 'ehvTile',
                  formatType: 'laser',
                  createdAt: '2024-01-02T15:04:05Z',
                  nodeID: 3
                },
                {
                  name: 'asset-02.kml',
                  displayName: 'asset-02.kml',
                  status: 'CONVERTED',
                  referenceId: 'asset-02',
                  ehvAssetType: 'ehvSpaceInfo',
                  formatType: 'kml',
                  createdAt: '2024-01-02T15:04:05Z',
                  nodeID: 4
                },
                {
                  name: 'asset-03.las',
                  displayName: 'asset-03.las',
                  status: 'CONVERTED',
                  referenceId: 'asset-03',
                  ehvAssetType: 'externalTileBe',
                  formatType: 'laser',
                  createdAt: '2024-01-02T15:04:05Z',
                  nodeID: 5
                },
                {
                  name: 'asset-04.las',
                  displayName: 'asset-04.las',
                  status: 'CONVERTED',
                  referenceId: 'asset-04',
                  ehvAssetType: 'externalTileAf',
                  formatType: 'laser',
                  createdAt: '2024-01-02T15:04:05Z',
                  nodeID: 6
                },
                {
                  name: 'asset-05.kml',
                  displayName: 'asset-05.kml',
                  status: 'CONVERTED',
                  referenceId: 'asset-05',
                  ehvAssetType: 'externalSpaceInfoBe',
                  formatType: 'kml',
                  createdAt: '2024-01-02T15:04:05Z',
                  nodeID: 7
                },
                {
                  name: 'asset-06.kml',
                  displayName: 'asset-06.kml',
                  status: 'CONVERTED',
                  referenceId: 'asset-06',
                  ehvAssetType: 'externalSpaceInfoAf',
                  formatType: 'kml',
                  createdAt: '2024-01-02T15:04:05Z',
                  nodeID: 8
                }
              ]
            }
          ]
        },
        {
          name: 'test2',
          displayName: 'test2',
          isDirectory: true,
          expanded: true,
          children: []
        }
      ]
    }
  ]
}

const externalServices = {
  description: 'List of external service integration settings',
  type: 'array',
  items: {
    description: 'External service integration settings',
    type: 'object',
    additionalProperties: false,
    properties: {
      type: {
        description: 'External service type',
        type: 'string'
      },
      status: {
        description: 'External Service Link Status',
        type: 'string',
        enum: ['ENABLED', 'DISABLED']
      }
    },
    required: ['type', 'status']
  },
  examples: [
    [
      {
        type: 'EXAMPLE_SERVICE',
        status: 'ENABLED'
      }
    ]
  ]
}

/**
 * Generate a fastify schema for site requests
 *
 * @function getRequestSiteSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/users/schema
 */
const getRequestSiteSchema = (fastify, { allowed = ['id'] }) => {
  const schema = {
    siteId: fastify.getSchema('siteId'),
    viewStructure
  }
  return _pick(schema, allowed)
}

/**
 * Generate a fastify schema for site responses
 *
 * @function getResponseSiteSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/users/schema
 */
const getResponseSiteSchema = (fastify, { allowed = ['id'] }) => {
  const schema = {
    id: fastify.getSchema('siteId'),
    name: {
      description: 'The site name',
      type: 'string',
      maxLength: 255,
      examples: ['現場サンプル001']
    },
    cesiumIonToken: {
      description: 'CesiumIon access tokens by site',
      type: 'string',
      examples: [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NDQ0MzE4Zi0yMDM5LTQ1NTAtYjlmMS0yNDJhZGI4MGYzNzciLCJpZCI6MjkwNTIsImlhdCI6MTcxNTc0OTE2NX0.dRYCiG6r-bwoNmfgTjMrBPmjV4rdStuKwU0ZmgBsw84'
      ]
    },
    location: {
      description: 'The location of the site',
      type: 'object',
      example: {
        lat: 35.603903966505904,
        lng: 140.08325438234084,
        zoom: 17,
        bounds: {
          bottom: 35.58198941047166,
          left: 140.0563049238173,
          right: 140.1102038408644,
          top: 35.62581252246515
        }
      },
      additionalProperties: true
    },
    attribute: {
      description: 'The attribute of the site',
      type: 'object',
      additionalProperties: true
    },
    viewStructure,
    externalServices,
    createdAt: fastify.getSchema('createdAt'),
    updatedAt: fastify.getSchema('updatedAt'),
    deletedAt: fastify.getSchema('deletedAt')
  }

  return _pick(schema, allowed)
}

/**
 * Generate a fastify schema for file-storage requests
 *
 * @function getRequestFileStorageSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/sites/schema
 */
const getRequestFileStorageSchema = (fastify, { allowed = ['bucketId'] }) => {
  const schema = {
    bucketId: {
      type: 'string',
      description: 'Bucket ID'
    },
    nodeId: {
      type: 'string',
      description: 'Node ID'
    },
    parentNodeId: {
      type: 'string',
      description: "Parent's node ID"
    }
  }

  return _pick(schema, allowed)
}

/**
 * Generate a fastify schema for file-storage responses
 *
 * @function getResponseFileStorageSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/sites/schema
 */
const getResponseFileStorageSchema = (fastify, { allowed = ['bucketId'] }) => {
  const schema = {
    bucketId: {
      type: 'string',
      description: 'Bucket ID'
    },
    nodeId: {
      type: 'string',
      description: 'Node ID'
    },
    name: {
      description: 'name',
      type: 'string',
      maxLength: 255
    },
    isDirectory: {
      description: 'Directory determination',
      type: 'boolean'
    }
  }

  return _pick(schema, allowed)
}

module.exports = {
  getResponseSiteSchema,
  getRequestSiteSchema,
  getRequestFileStorageSchema,
  getResponseFileStorageSchema
}
