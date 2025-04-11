// Copyright (c) 2025 NTT InfraNet
'use strict'

const {
  ASSET_CATEGORY,
  ASSET_FORMAT_TYPE,
  ASSET_CONVERT_TYPE,
  FME_CONVERT_TYPE,
  CESIUM_ION_API_TYPE_INFO: { TYPE: CI_TYPE, SOURCE_TYPE: CI_SOURCE_TYPE }
} = require('../constants')

const { getExtension } = require('../../../lib/utils/extension')

const assetConvertInformation = () => ({
  [ASSET_FORMAT_TYPE.LASER]: {
    uploadExtensions: ['las', 'laz', 'zip'],
    enableMeasurement: true,
    assetType: [ASSET_CATEGORY.TOPOGRAPHY],
    convert: { is: false },
    cesiumIonTypeInfo: {
      base: CI_TYPE.TILES3D,
      params: {
        [CI_TYPE.TILES3D]: {
          type: CI_TYPE.TILES3D,
          sourceType: CI_SOURCE_TYPE.POINT_CLOUD,
          usingInputCrs: true,
          usingFlipXY: false
        }
      }
    },
    addTerrainFormatType: ASSET_FORMAT_TYPE.LASER_DEM
  },
  [ASSET_FORMAT_TYPE.LASER_DEM]: {
    uploadExtensions: ['las'],
    enableMeasurement: false,
    assetType: [ASSET_CATEGORY.TOPOGRAPHY],
    convert: {
      is: true,
      type: ASSET_CONVERT_TYPE.FME,
      fmeConvertType: FME_CONVERT_TYPE.LAS_DEM,
      extension: 'zip'
    },
    cesiumIonTypeInfo: {
      base: CI_TYPE.TERRAIN,
      params: {
        [CI_TYPE.TERRAIN]: {
          type: CI_TYPE.TERRAIN,
          sourceType: CI_SOURCE_TYPE.RASTER_TERRAIN,
          usingInputCrs: false,
          usingFlipXY: false
        }
      }
    }
  },
  [ASSET_FORMAT_TYPE.GEO_JSON]: {
    uploadExtensions: ['geojson', 'topojson', 'json', 'zip'],
    enableMeasurement: false,
    assetType: [ASSET_CATEGORY.OVERLAY],
    convert: { is: false },
    cesiumIonTypeInfo: {
      base: CI_TYPE.GEOJSON,
      params: {
        [CI_TYPE.GEOJSON]: {
          type: CI_TYPE.GEOJSON,
          sourceType: CI_SOURCE_TYPE.GEOJSON,
          usingInputCrs: false,
          usingFlipXY: false
        }
      }
    }
  },
  [ASSET_FORMAT_TYPE.CITY_GML]: {
    uploadExtensions: ['gml', 'zip'],
    enableMeasurement: false,
    assetType: [ASSET_CATEGORY.MODEL3D, ASSET_CATEGORY.DESIGN_FILE],
    convert: { is: false },
    cesiumIonTypeInfo: {
      base: CI_TYPE.TILES3D,
      params: {
        [CI_TYPE.TILES3D]: {
          type: CI_TYPE.TILES3D,
          sourceType: CI_SOURCE_TYPE.CITYGML,
          usingInputCrs: false,
          usingFlipXY: false
        }
      }
    }
  },
  [ASSET_FORMAT_TYPE.GLTF]: {
    uploadExtensions: ['gltf', 'glb', 'zip'],
    enableMeasurement: false,
    assetType: [ASSET_CATEGORY.DESIGN_FILE],
    convert: { is: false },
    cesiumIonTypeInfo: {
      base: CI_TYPE.TILES3D,
      params: {
        [CI_TYPE.TILES3D]: {
          type: CI_TYPE.TILES3D,
          sourceType: CI_SOURCE_TYPE.TILES3D,
          usingInputCrs: false,
          usingFlipXY: false
        }
      }
    }
  }
})

/**
 * Asset information
 *
 * @class AssetInfo
 * @param {Object} options
 * @param {String} options.name - Asset File Name
 * @param {String} options.category - Asset Classification
 * @param {String} options.formatType - Asset format type
 * @param {Object} options.cesiumOptions - Configuring CesiumIon Uploads
 * @param {Object} options.verifyParams - Checking parameters
 */
class AssetInfo {
  constructor({
    name,
    category,
    formatType,
    cesiumOptions,
    verifyParams: { ionType, ionSourceType } = {},
    bucket = '',
    assetKey = ''
  }) {
    this.name = name
    this.category = category
    this.formatType = formatType
    this.cesiumOptions = cesiumOptions || {}
    this.assetInfo = null
    this.verifyAssetInfo({
      ionType,
      ionSourceType
    })

    this.bucket = bucket
    this.assetKey = assetKey
    if (
      this.assetInfo &&
      this.assetInfo.baseCesiumOptions &&
      Object.keys(this.assetInfo.baseCesiumOptions).length
    ) {
      this.cesiumOptions = {
        ...this.assetInfo.baseCesiumOptions,
        ...this.cesiumOptions
      }
    }
  }

  static getAssetConvertInformation() {
    return assetConvertInformation()
  }

  verifyAssetInfo({ ionType, ionSourceType }) {
    const extLowerCase = getExtension(this.name).toLowerCase()
    const assetInfo = assetConvertInformation()[this.formatType]

    if (!extLowerCase || !assetInfo) return
    if (this.category && !assetInfo.assetType.includes(this.category)) return
    if (!assetInfo.uploadExtensions.includes(extLowerCase)) return

    const cesiumIonType = assetInfo.cesiumIonTypeInfo.base

    assetInfo.cesiumIon = assetInfo.cesiumIonTypeInfo.params[cesiumIonType]
    if (
      !assetInfo.cesiumIon ||
      (ionType && assetInfo.cesiumIon.type !== ionType) ||
      (ionSourceType && assetInfo.cesiumIon.sourceType !== ionSourceType)
    )
      return

      this.assetInfo = assetInfo
  }

  get() {
    return this.assetInfo
  }

  getBaseList() {
    return this.baseAssetList
  }

  getConvertName(convertExt = '') {
    const beforeExt = getExtension(this.name)
    const afterExt =
      convertExt || (this.assetInfo ? this.assetInfo.convert.extension : '')
    if (beforeExt && afterExt) {
      const beforeExtReg = new RegExp(`.${beforeExt}$`, 'i')
      return this.name.replace(beforeExtReg, `.${afterExt}`)
    }
    return this.name
  }

  async getConvertReadStream(readStream) {
    return readStream
  }

  generateCesiumIonCreateAssetBody(credentials) {
    const { tilesetJsonPath, baseTerrainId, position } = this.cesiumOptions
    const baseTerrainIdObj =
      this.assetInfo.cesiumIon.type === CI_TYPE.TERRAIN ? { baseTerrainId } : {}
    const bodyObj = {
      name: this.getConvertName(),
      description: '',
      type: this.assetInfo.cesiumIon.type,
      options: {
        ...baseTerrainIdObj,
        sourceType: this.assetInfo.cesiumIon.sourceType,
        tilesetJson: [
          ASSET_FORMAT_TYPE.FILMBOX,
          ASSET_FORMAT_TYPE.TILES_3D,
          ASSET_FORMAT_TYPE.IFC,
          ASSET_FORMAT_TYPE.DWG,
          ASSET_FORMAT_TYPE.GLTF,
        ].includes(this.formatType)
          ? tilesetJsonPath
          : '',
        position:
          ([ASSET_FORMAT_TYPE.GLTF].includes(this.formatType) && position) ||
          undefined
      },
      from: {
        type: 'S3',
        bucket: this.bucket,
        credentials: {
          accessKey: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken
        },
        keys: [this.assetKey]
      }
    }

    return JSON.stringify(bodyObj)
  }
}

module.exports = AssetInfo
