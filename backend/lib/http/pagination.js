// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * Pagination Utils
 * @module lib/http/pagination
 */

/**
 * Get the current page starting from the `offset` and the `limit`

 * @param {number} offset - The offset
 * @param {number} resultPerPage - The limit
 * @returns {number} The current page
 * @memberof lib/http/pagination
 */
const getPage = (offset, resultPerPage) => Math.floor(offset / resultPerPage)

/**
 * Get the total pages in current query
 *
 * @param {number} totalItems - The total number of items
 * @param {number} resultPerPage - The result per page
 * @returns {number}
 * @memberof lib/http/pagination
 */
const getTotalPages = (totalItems, resultPerPage) =>
  totalItems ? Math.floor((totalItems - 1) / resultPerPage) + 1 : 0

/**
 * Check if a next page is available
 *
 * @param {number} offset - The offset of the request
 * @param {number } resultPerPage - the number of result per page
 * @param {number} totalItems - The total number of items
 * @returns {boolean} True if a next page is available, false otherwise
 * @memberof lib/http/pagination
 */
const hasNext = (offset, resultPerPage, totalItems) => {
  return (
    getPage(offset, resultPerPage) <
    getTotalPages(totalItems, resultPerPage) - 1
  )
}

/**
 * Check if a prev page is available
 *
 * @param {number} offset - The offset of the request
 * @param {number } resultPerPage - the number of result per page
 * @returns {boolean} True if a prev page is available, false otherwise
 * @memberof lib/http/pagination
 */
const hasPrev = (offset, resultPerPage) => {
  return getPage(offset, resultPerPage) > 0
}

module.exports = {
  getPage,
  getTotalPages,
  hasNext,
  hasPrev
}
