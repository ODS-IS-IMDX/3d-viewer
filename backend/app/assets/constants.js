// Copyright (c) 2025 NTT InfraNet
const ASSET_STATUS = {
  /**
   * Asset status: S3 upload wait (file upload)
   */
  S3_UPLOAD_WAIT: 'S3_UPLOAD_WAIT',
  /**
   * S3 upload file virus scan processing
   */
  S3_VIRUS_SCAN_IN_PROGRESS: 'S3_VIRUS_SCAN_IN_PROGRESS',
  /**
   * S3 upload file virus scan upload error
   */
  S3_VIRUS_SCAN_UPLOAD_ERROR: 'S3_VIRUS_SCAN_UPLOAD_ERROR',
  /**
   * S3 upload file, virus scan, and results are not allowed
   */
  S3_VIRUS_SCAN_RESULT_NG: 'S3_VIRUS_SCAN_RESULT_NG',
  /**
   * Asset status: S3 upload completed
   */
  S3_UPLOAD_COMPLETE: 'S3_UPLOAD_COMPLETE',
  /**
   * Asset Status: S3 upload failed
   */
  S3_UPLOAD_ERROR: 'S3_UPLOAD_ERROR',
  /**
   * Asset status: Copying completed in Conversion Tool Link File S3, Conversion Tool Link File
   */
  S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL: 'S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL',
  /**
   * Asset status: Copy in Conversion Tool Linked File S3 failed
   */
  S3_UPLOAD_ERROR_TO_CONVERT_TOOL: 'S3_UPLOAD_ERROR_TO_CONVERT_TOOL',
  /**
   * Asset status: Conversion completed copy in file S3 completed
   */
  S3_COPY_COMPLETE_FROM_CONVERT_TOOL: 'S3_COPY_COMPLETE_FROM_CONVERT_TOOL',
  /**
   * Asset status: Copy in Conversion Completed File S3 failed
   */
  S3_COPY_ERROR_FROM_CONVERT_TOOL: 'S3_COPY_ERROR_FROM_CONVERT_TOOL',
  /**
   * Asset status: Copy wait in external linkage file S3
   */
  S3_COPY_WAIT_FROM_EXTERNAL: 'S3_COPY_WAIT_FROM_EXTERNAL',
  /**
   * Asset status: Copying in external linkage file S3 completed
   */
  S3_COPY_COMPLETE_FROM_EXTERNAL: 'S3_COPY_COMPLETE_FROM_EXTERNAL',
  /**
   * Asset status: Copy in external linkage file S3 failed
   */
  S3_COPY_ERROR_FROM_EXTERNAL: 'S3_COPY_ERROR_FROM_EXTERNAL',
  /**
   * Asset Status: CesiumIon Asset Creation in progress
   */
  CONVERTING: 'CONVERTING',
  /**
   * Asset Status: CesiumIon Asset Creation Completed
   */
  CONVERTED: 'CONVERTED',
  /**
   * Asset Status: CesiumIon Asset Creation Failed
   */
  CONVERT_ERROR: 'CONVERT_ERROR',
  /**
   * Asset Status: Conversion Failed with Conversion Tool
   */
  CONVERT_TOOL_ERROR: 'CONVERT_TOOL_ERROR',
  /**
   * Asset status: External linkage update
   */
  EXTENAL_UPDATE: 'EXTENAL_UPDATE',
  /**
   * Asset Status: Waiting for deletion
   */
  DELETE_WAIT: 'DELETE_WAIT',
  /**
   * Asset Status: Delete Completed
   */
  DELETE_COMPLETE: 'DELETE_COMPLETE',
  /**
   * Asset Status: Deletion Failed
   */
  DELETE_ERROR: 'DELETE_ERROR',
}

const ASSET_ERRORS = {
  ERROR_S3_DL: 'ERROR_S3_DL',
  ERROR_S3_TO: 'ERROR_S3_TO',
  ERROR_FME_REQUEST: 'ERROR_FME_REQUEST',
  ERROR_ION: 'ERROR_ION',
  ERROR_ION_DATA: 'ERROR_ION_DATA',
  ERROR_ION_TO: 'ERROR_ION_TO',
  ERROR_ION_GET: 'ERROR_ION_GET',
  ERROR_FORMAT_CONVERT: 'ERROR_FORMAT_CONVERT'
}

const ASSET_CATEGORY = {
  TOPOGRAPHY: 'topography',
  IMAGERY: 'imagery',
  DESIGN_FILE: 'designFile',
  OVERLAY: 'overlay',
  MODEL3D: 'model3d'
}

const EHV_ASSET_TYPE = {
  /**
   * EHV Asset Type: EHV File Upload/3DTile
   */
  EHV_TILE: 'ehvTile',
  /**
   * EHV Asset Type: EHV File Upload/Spatial ID
   */
  EHV_SPACE_INFO: 'ehvSpaceInfo',
  /**
   * EHV asset type: External linkage/3DTile/Before approval
   */
  EXTERNAL_TILE_BE: 'externalTileBe',
  /**
   * EHV asset type: External linkage/3DTile/After approval
   */
  EXTERNAL_TILE_AF: 'externalTileAf',
  /**
   * EHV asset type: External linkage/Spatial ID/Before approval
   */
  EXTERNAL_SPACE_INFO_BE: 'externalSpaceInfoBe',
  /**
   * EHV asset type: External linkage/Spatial ID/After approval
   */
  EXTERNAL_SPACE_INFO_AF: 'externalSpaceInfoAf'
}

const ASSET_FORMAT_TYPE = {
  GEO_TIFF: 'geotiff',
  LASER: 'laser',
  LASER_DEM: 'laser-dem',
  KML: 'kml',
  SHAPE: 'shape',
  LAND_XML: 'landxml',
  DXF: 'dxf',
  CITY_GML: 'citygml',
  CZML: 'czml',
  GEO_JSON: 'geojson',
  FILMBOX: 'filmbox',
  WAVEFRONT_OBJ: 'wavefrontobj',
  COLLADA: 'collada',
  JPEG: 'jpeg',
  TIFF: 'tiff',
  PNG: 'png',
  TILES_3D: '3dtiles',
  IFC: 'ifc',
  DWG: 'dwg',
  GLTF: 'gltf'
}

const ASSET_CONVERT_TYPE = {
  OGR2OGR: 'OGR2OGR',
  GDAL_TRANSLATE: 'GDAL_TRANSLATE',
  SHAPE_MERGE: 'SHAPE_MERGE',
  FME: 'FME',
  GDAL_WARP: 'GDAL_WARP',
  GLTF_ANALYSIS: 'GLTF_ANALYSIS'
}

const FME_CONVERT_TYPE = {
  DXF_3DTILES: 'DXF_3DTILES',
  DWG_3DTILES: 'DWG_3DTILES',
  FBX_3DTILES: 'FBX_3DTILES',
  ZIP_3DTILES: 'ZIP_3DTILES',
  IFC_3DTILES: 'IFC_3DTILES',
  RVT_3DTILES: 'RVT_3DTILES',
  XML_3DTILES: 'XML_3DTILES',
  LAS_TIFF: 'LAS_TIFF',
  LAS_DEM: 'LAS_DEM',
  TEST_CONVERT: 'TEST_CONVERT'
}

const CESIUM_ION_API_TYPE_INFO = {
  TYPE: {
    TILES3D: '3DTILES',
    GLTF: 'GLTF',
    IMAGERY: 'IMAGERY',
    TERRAIN: 'TERRAIN',
    KML: 'KML',
    CZML: 'CZML',
    GEOJSON: 'GEOJSON'
  },
  SOURCE_TYPE: {
    RASTER_IMAGERY: 'RASTER_IMAGERY',
    RASTER_TERRAIN: 'RASTER_TERRAIN',
    TERRAIN_DATABASE: 'TERRAIN_DATABASE',
    CITYGML: 'CITYGML',
    KML: 'KML',
    CAPTURE3D: '3D_CAPTURE',
    MODEL3D: '3D_MODEL',
    POINT_CLOUD: 'POINT_CLOUD',
    TILES3D: '3DTILES',
    CZML: 'CZML',
    GEOJSON: 'GEOJSON',
    SMARTCONSTRUCTION_DXF: 'SMARTCONSTRUCTION_DXF' // Features developed by cesium for dxf and landXML (not listed on cesium-ion's website)
  }
}

const LL_ASSET_TYPES = {
  [ASSET_CATEGORY.TOPOGRAPHY]: 'Topography',
  [ASSET_CATEGORY.IMAGERY]: 'Imagery',
  [ASSET_CATEGORY.DESIGN_FILE]: 'Design file',
  [ASSET_CATEGORY.OVERLAY]: 'Overlay',
  [ASSET_CATEGORY.MODEL3D]: '3D model'
}

const VIEW_STRUCTURE_DEFAULT = [
  {
    name: '点群データ',
    displayName: '点群データ',
    isDirectory: true,
    expanded: true,
    nodeID: 1,
    children: []
  },
  {
    name: '点群データから空間ID変換',
    displayName: '点群データから空間ID変換',
    isDirectory: true,
    expanded: true,
    nodeID: 2,
    children: []
  },
  {
    name: 'CityGML 3Dモデル',
    displayName: 'CityGML 3Dモデル',
    isDirectory: true,
    expanded: true,
    nodeID: 3,
    children: []
  },
  {
    name: '空間IDデータ',
    displayName: '空間IDデータ',
    isDirectory: true,
    expanded: true,
    nodeID: 4,
    children: []
  }
]

const VIEW_STRUCTURE_BRANCH = {
  BEFORE: {
    name: '承認前',
    displayName: '承認前',
    isDirectory: true,
    expanded: true,
    nodeID: 0,
    children: []
  },
  AFTER: {
    name: '公開中',
    displayName: '公開中',
    isDirectory: true,
    expanded: true,
    nodeID: 0,
    children: []
  }
}

module.exports = {
  ASSET_STATUS,
  ASSET_ERRORS,
  EHV_ASSET_TYPE,
  ASSET_CATEGORY,
  ASSET_FORMAT_TYPE,
  ASSET_CONVERT_TYPE,
  FME_CONVERT_TYPE,
  CESIUM_ION_API_TYPE_INFO,
  LL_ASSET_TYPES,
  VIEW_STRUCTURE_DEFAULT,
  VIEW_STRUCTURE_BRANCH
}
