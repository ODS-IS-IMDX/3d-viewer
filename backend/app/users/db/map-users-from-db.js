// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * Format a user object from the database
 *
 * @param {Object} raw - The raw user object
 * @returns {Object} A formatted user object with role information
 * @module app/users/db/map-users-from-db
 */
module.exports = function mapUserFromDb(raw) {
  if (!raw) return null

  const {
    id,
    loginUserId,
    corporationId,
    licenseItemIdList,
    email,
    firstName,
    lastName,
    title,
    phone,
    company,
    timezone,
    language,
    disabled,
    firstLogin,
    createdAt,
    updatedAt,
    deletedAt,
    corporationName
  } = raw

  return {
    id,
    loginUserId,
    corporationId,
    licenseItemIdList,
    email,
    firstName,
    lastName,
    title,
    phone,
    company,
    timezone,
    language,
    disabled,
    firstLogin,
    createdAt,
    updatedAt,
    deletedAt,
    corporationName
  }
}
