// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * Format a site object from the database
 *
 * @param {Object} raw - The raw site object
 * @returns {Object} A formatted site object
 * @module app/users/db/map-users-from-db
 */
module.exports = function mapSitesFromDb(raw) {
  if (!raw) return null

  const {
    id,
    corporationId,
    name,
    location,
    attribute,
    viewStructure,
    cesiumIonTokenId,
    cesiumIonTokenValue,
    createdAt,
    updatedAt,
    deletedAt
  } = raw

  return {
    id,
    corporationId,
    name,
    location,
    attribute,
    viewStructure,
    cesiumIonTokenId,
    cesiumIonTokenValue,
    cesiumIonToken: cesiumIonTokenValue,
    createdAt,
    updatedAt,
    deletedAt
  }
}
