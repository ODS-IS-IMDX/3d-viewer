// Copyright (c) 2025 NTT InfraNet
'use strict'

const attributeMapping = {
  created: 'createdAt',
  updated: 'updatedAt',
  deleted: 'deletedAt'
}

/**
 * Map attribute for sorting
 *
 * @param {String} attribute - One of 'created', 'updated' or 'deleted'
 * @returns {String} The matching database attribute name
 * @module lib/utils/map-attribute-for-sorting
 */
module.exports = attribute => attributeMapping[attribute] || attribute
