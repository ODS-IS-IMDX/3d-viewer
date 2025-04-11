// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * extension utils
 * @module lib/utils/extension
 */

/**
 * 拡張子取得
 *
 * @name getExtension
 * @memberof lib/utils/extension
 * @returns {String} 拡張子に該当する文字列
 */
module.exports.getExtension = fileName => {
  const expReg = /(?:\.([^.]+))?$/
  return (fileName.match(expReg)[1] || '')
}
