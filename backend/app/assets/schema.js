// Copyright (c) 2025 NTT InfraNet
'use strict'
/**
 * Fastify schema for assets
 * @module app/assets/schema
 */
const _pick = require('lodash/pick')

const {
  CESIUM_ION_API_TYPE_INFO: { TYPE: CESIUM_ION_TYPE },
  EHV_ASSET_TYPE
} = require('./constants')

const assetStatus = {
  description: 'The status of the asset',
  type: 'string'
}

const assetCategory = {
  description: 'Asset Classification',
  type: 'string'
}

const formatType = {
  description: 'Asset format type',
  type: 'string'
}

const ionAssetType = {
  description: 'CesiumION Asset Type',
  type: 'string',
  enum: Object.values(CESIUM_ION_TYPE)
}

const cesiumOptions = {
  srid: {
    description: 'Coordinate System (SRID)',
    type: 'integer',
    minimum: 1024,
    maximum: 32766
  },
  verticalSrid: {
    description: 'Elevation Reference (SRID)',
    type: 'integer',
    minimum: 1024,
    maximum: 32766
  },
  flipXY: {
    description: 'XY Reverse',
    type: 'boolean'
  },
  tilesetJsonPath: {
    description: 'Relative path of tileset.json',
    type: 'string'
  },
  isTerrain: {
    description: 'Whether or not the data will be used as terrain target data?',
    type: 'boolean'
  },
  baseTerrainId: {
    description: 'CesiumIonAssetId that is the source of terrain merge',
    type: 'integer',
    minimum: 1
  },
  invertXY: {
    description: 'XY inversion (used when converting FME)',
    type: 'integer'
  },
  flipTexture: {
    description: 'Texture inversion (used when converting FME)',
    type: 'integer'
  },
  addTerrain: {
    description: 'Whether or not to add data to the terrain target?',
    type: 'boolean'
  },
  cellSpacing: {
    description: 'Cell interval (used during FME conversion)',
    type: 'number',
    exclusiveMinimum: 0,
    examples: [1]
  },
  position: {
    type: 'array',
    description:
      'Default position for 3d model ([Longitude, Latitude, Ellipsoid Height])',
    items: {
      type: 'number'
    },
    examples: [[135.0123, 40.4567, 100.89]]
  }
}

const customPosition = {
  description: 'Location Information',
  type: 'object',
  additionalProperties: true,
  nullable: true
}

const isSpace = {
  description: 'Whether to make spatial ID?',
  type: 'boolean'
}

const customStyle = {
  description: 'User-Customized Asset Display Style on Map',
  type: 'object',
  additionalProperties: true,
  nullable: true
}

const ionPercentComplete = {
  description: 'CesiumIon Asset Conversion Progress Rate 0-100',
  type: 'integer'
}

const ehvAssetType = {
  description: 'EHV Asset Registration Type',
  type: 'string',
  enum: [
    EHV_ASSET_TYPE.EHV_TILE,
    EHV_ASSET_TYPE.EHV_SPACE_INFO,
    EHV_ASSET_TYPE.EXTERNAL_TILE_AF,
    EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE,
    EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF
  ]
}

const exampleValues = {
  customPosition: {
    transform: [
      -0.7596848374009469,
      -0.6502914329922367,
      0,
      0,
      0.3617207131705919,
      -0.422570138906991,
      0.8310190150456755,
      0,
      -0.5404045461378495,
      0.6313125453220692,
      0.5562440081767311,
      0,
      -3450364.623906323,
      4030792.2806627946,
      3527721.0540310917,
      1
    ]
  }
}

/**
 * Generate a fastify schema for assets requests
 *
 * @function getRequestAssetsSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/users/schema
 */
const getRequestAssetsSchema = (fastify, { allowed = ['id'] }) => {
  const schema = {
    id: fastify.getSchema('assetId'),
    siteId: fastify.getSchema('siteId'),
    name: {
      description: 'Asset File Name',
      type: 'string',
      maxLength: 255
    },
    displayName: {
      description: 'Asset Display Name',
      type: 'string',
      maxLength: 255
    },
    category: assetCategory,
    formatType,
    cesiumOptions: {
      description: 'json for asset tiling parameters',
      type: 'object',
      additionalProperties: false,
      properties: cesiumOptions
    },
    isSpace,
    startDateTime: {
      description: 'Asset start date and time',
      type: 'string',
      format: 'date-time',
      nullable: true
    },
    endDateTime: {
      description: 'End date and time of the asset',
      type: 'string',
      format: 'date-time',
      nullable: true
    },
    status: {
      type: 'array',
      items: {
        assetStatus
      }
    },
    fileStorageNodeId: {
      description: 'LL File Management Bucket ID',
      type: 'string'
    },
    customPosition,
    customStyle
  }

  return _pick(schema, allowed)
}

/**
 * Generate a fastify schema for asset responses
 *
 * @function getResponseAssetsSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/assets/schema
 */
const getResponseAssetsSchema = (fastify, { allowed = ['id'] }) => {
  const schema = {
    id: fastify.getSchema('assetId'),
    contentId: fastify.getSchema('contentId'),
    ionAssetId: fastify.getSchema('ionAssetId'),
    name: {
      description: 'Asset File Name',
      type: 'string',
      maxLength: 255
    },
    displayName: {
      description: 'Asset Display Name',
      type: 'string',
      maxLength: 255
    },
    isDisplay: {
      description: 'Indicate/non-expression',
      type: 'boolean',
      default: false
    },
    status: assetStatus,
    ionPercentComplete,
    formatType,
    customPosition,
    category: assetCategory,
    ionAssetType,
    ehvAssetType,
    startDateTime: {
      description: 'Asset start date and time',
      type: 'string',
      format: 'date-time'
    },
    endDateTime: {
      description: 'End date and time of the asset',
      type: 'string',
      format: 'date-time'
    },
    createdBy: {
      description: 'Subscriber',
      type: 'object',
      required: ['firstName', 'lastName'],
      properties: {
        firstName: {
          type: 'string',
          description: ''
        },
        lastName: {
          type: 'string',
          description: ''
        },
        userId: {
          type: 'string',
          description: ''
        },
        email: {
          type: 'string',
          description: ''
        }
      }
    },
    createdAt: fastify.getSchema('createdAt'),
    updatedAt: fastify.getSchema('updatedAt'),
    deletedAt: fastify.getSchema('deletedAt')
  }

  return _pick(schema, allowed)
}

module.exports = {
  getRequestAssetsSchema,
  getResponseAssetsSchema,
  exampleValues
}
