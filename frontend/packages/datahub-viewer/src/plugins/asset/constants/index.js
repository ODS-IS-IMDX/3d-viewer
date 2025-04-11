// Copyright (c) 2025 NTT InfraNet
// @flow
import type { FormatType, FormatTypeValue } from 'plugins/asset/types'

export const FORMAT_TYPE: FormatType = {
  LASER: { NAME: 'LASer', VALUE: 'laser' },
  CITYGML: { NAME: 'CityGML', VALUE: 'citygml' },
  GLTF: { NAME: 'Gltf', VALUE: 'gltf' }
}
export const assetTypes = {
  designFile: {
    category: 'designFile',
    fileExtensions: ['citygml', 'gml', 'zip'],
    extensionsLabel: `${FORMAT_TYPE.CITYGML.NAME}`
  },
  topography: {
    category: 'topography',
    fileExtensions: ['las'],
    extensionsLabel: `${FORMAT_TYPE.LASER.NAME}`,
    fileExtensionsForPointSize: ['las']
  }
}
export const PROJECTION_AVAILABLE_FORMAT_TYPE_LIST: Array<FormatTypeValue> = [
  'laser'
]
export const CESIUM_ION_TYPES = {
  TILES3D: '3DTILES',
  GLTF: 'GLTF',
  IMAGERY: 'IMAGERY',
  TERRAIN: 'TERRAIN',
  KML: 'KML',
  CZML: 'CZML',
  GEOJSON: 'GEOJSON'
}
export const ASSET_STATUS = {
  UPLOAD_PREPARATION: 'UPLOAD_PREPARATION',
  UPLOAD_WAIT: 'UPLOAD_WAIT',
  UPLOADING: 'UPLOADING',
  UPLOADING_S3: 'UPLOADING_S3',
  UPLOADING_S3_DL: 'UPLOADING_S3_DL',
  PRE_CONVERT_WAIT: 'PRE_CONVERT_WAIT',
  PRE_CONVERT_UPLOADING: 'PRE_CONVERT_UPLOADING',
  PRE_CONVERTING: 'PRE_CONVERTING',
  UPLOADING_ION_UP: 'UPLOADING_ION_UP',
  UPLOADING_ION_NOTICE: 'UPLOADING_ION_NOTICE',
  CONVERTING: 'CONVERTING',
  CONVERTED: 'CONVERTED',
  DELETE_WAIT: 'DELETE_WAIT',
  DELETE_COMPLEATE: 'DELETE_COMPLEATE',
  ERROR_S3: 'ERROR_S3',
  ERROR_S3_DOWNLOAD: 'ERROR_S3_DOWNLOAD',
  ERROR_ION: 'ERROR_ION',
  ERROR_ION_DATA: 'ERROR_ION_DATA',
  ERROR_ION_TO: 'ERROR_ION_TO'
}
export const DEFAULT_FORMAT_TYPE = {
  designFile: {
    citygml: FORMAT_TYPE.CITYGML.VALUE,
    gml: FORMAT_TYPE.CITYGML.VALUE,
    zip: FORMAT_TYPE.CITYGML.VALUE
  },
  topography: {
    las: FORMAT_TYPE.LASER.VALUE,
    laz: FORMAT_TYPE.LASER.VALUE,
    zip: FORMAT_TYPE.LASER.VALUE
  }
}
export const COORDINATE_DIGIT_AFTER_DECIMAL_POINT = 8

export const DEFAULT_CUSTOM_POSITION = {
  isDecimalCoordinate: true,
  lat: { decimal: '', degree: '', minute: '', second: '' },
  lon: { decimal: '', degree: '', minute: '', second: '' },
  ellipsoidHeight: '',
  heading: '',
  pitch: '',
  roll: ''
}
