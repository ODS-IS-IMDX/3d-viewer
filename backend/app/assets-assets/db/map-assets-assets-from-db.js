// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * Format a assets-assets object from the database
 *
 * @param {Object} raw - The raw assets-assets object
 * @returns {Object} A formatted assets-assets object
 * @module app/assets-assets/db/map-assets-assets-from-db
 */
 module.exports.mapAssetsAssetsFromDb = function mapAssetsAssetsFromDb(raw) {
  if (!raw) return null

  const {
    id,
    siteId,
    assetId,
    baseIonAssetId,
    baseFileStorageNodeId,
    baseConversionOperationId,
    baseName,
    baseDisplayName,
    baseStatus,
    baseCategory,
    baseFormatType,
    baseCustomPosition,
    baseIonType,
    baseIonSourceType,
    baseIsMeasurement,
    baseStartDateTime,
    baseEndDateTime,
    baseCesiumOptions,
    linkedAssetId,
    linkedIonAssetId,
    linkedFileStorageNodeId,
    linkedConversionOperationId,
    linkedName,
    linkedDisplayName,
    linkedStatus,
    linkedCategory,
    linkedFormatType,
    linkedCustomPosition,
    linkedIonType,
    linkedIonSourceType,
    linkedIsMeasurement,
    linkedStartDateTime,
    linkedEndDateTime,
    linkedCesiumOptions,
    type,
    cFirstName,
    cLastName,
    createdBy,
    createdAt,
    uFirstName,
    uLastName,
    updatedBy,
    updatedAt,
    deletedAt
  } = raw

  return {
    id,
    siteId,
    baseAsset: {
      assetId,
      ionAssetId: baseIonAssetId,
      ionAssetType: baseIonType,
      fileStorageNodeId: baseFileStorageNodeId,
      conversionOperationId: baseConversionOperationId,
      name: baseName,
      displayName: baseDisplayName || baseName,
      status: baseStatus,
      category: baseCategory,
      formatType: baseFormatType,
      customPosition: baseCustomPosition || {},
      ionType: baseIonType,
      ionSourceType: baseIonSourceType,
      isMeasurement: Boolean(baseIsMeasurement),
      startDateTime: baseStartDateTime,
      endDateTime: baseEndDateTime,
      cesiumOptions: baseCesiumOptions
    },
    linkedAsset: {
      assetId: linkedAssetId,
      ionAssetId: linkedIonAssetId,
      ionAssetType: linkedIonType,
      fileStorageNodeId: linkedFileStorageNodeId,
      conversionOperationId: linkedConversionOperationId,
      name: linkedName,
      displayName: linkedDisplayName || linkedName,
      status: linkedStatus,
      category: linkedCategory,
      formatType: linkedFormatType,
      customPosition: linkedCustomPosition || {},
      ionType: linkedIonType,
      ionSourceType: linkedIonSourceType,
      isMeasurement: Boolean(linkedIsMeasurement),
      startDateTime: linkedStartDateTime,
      endDateTime: linkedEndDateTime,
      cesiumOptions: linkedCesiumOptions
    },
    type,
    createdBy: {
      firstName: cFirstName,
      lastName: cLastName,
      userId: createdBy,
    },
    createdAt,
    updatedBy: {
      firstName: uFirstName,
      lastName: uLastName,
      userId: updatedBy,
    },
    updatedAt,
    deletedAt
  }
}
