// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * Format a assets object from the database
 *
 * @param {Object} raw - The raw asset object
 * @returns {Object} A formatted asset object
 * @module app/assets/db/map-assets-from-db
 */
module.exports = function mapAssetsFromDb(raw) {
  if (!raw) return null

  const {
    id,
    contentId,
    ehvAssetType,
    ionAssetId,
    ionPercentComplete,
    ionOnComplete,
    name,
    displayName,
    status,
    category,
    formatType,
    customPosition,
    customStyle,
    ionType,
    ionSourceType,
    startDateTime,
    endDateTime,
    cesiumOptions,
    firstName,
    lastName,
    userId,
    email,
    createdAt,
    updatedAt,
    deletedAt,
  } = raw

  return {
    id,
    contentId,
    ehvAssetType,
    ionAssetId,
    ionPercentComplete,
    ionOnComplete,
    name,
    displayName: displayName || name,
    status,
    category,
    formatType,
    customPosition,
    customStyle,
    ionAssetType: ionType,
    ionSourceType,
    isDisplay: true,
    userId,
    startDateTime,
    endDateTime,
    cesiumOptions,
    createdBy: {
      firstName: firstName,
      lastName: lastName,
      userId,
      email
    },
    createdAt,
    updatedAt,
    deletedAt,
  }
}
