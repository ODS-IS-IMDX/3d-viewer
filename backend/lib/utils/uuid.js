// Copyright (c) 2025 NTT InfraNet
const short = require('short-uuid')
const translator = short()

/**
 * UUID utils
 * @module lib/utils/uuid
 */

/**
 * Generate a new UUID
 *
 * @name getUuid
 * @memberof lib/utils/uuid
 * @returns {String} A 22 character uuid string
 */
module.exports.getUuid = function _getUuid() {
  let uuid = ''
  while (uuid.length !== 22) {
    uuid = translator.generate()
  }
  return uuid
}
