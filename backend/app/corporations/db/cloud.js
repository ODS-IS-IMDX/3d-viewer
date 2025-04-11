// Copyright (c) 2025 NTT InfraNet
'use strict'

const SQL = require('@nearform/sql')
const Boom = require('@hapi/boom')

const {
  GenericServerError,
  EntityNotFoundError
} = require('../../../lib/errors')

const {
  addIdFilter,
  addColumnFilter,
  addShowNotDeletedFilter,
  generateQueryInsert,
  generateQueryUpdateBase
} = require('../../../lib/utils/db-filters')
const { LOG_ERROR } = require('../../../lib/constants')

/**
 * Cloud Database adapter to support Corporations
 *
 * @class CorporationsDbAdapter
 * @param {Object} options - An Object containing logger and database instances
 * @param {Object} options.fastify - The Fastify instance
 * @param {Object} options.mysql - The MySQL client instance
 * @param {Object} options.log - Logger instance
 */
class CorporationsApiAdapter {
  constructor(options) {
    this.fastify = options.fastify
    this.mysql = options.mysql
    this.log = options.log
  }

  /**
   * list corporations from corporations table
   *
   * @param {Object} options
   * @param {String} options.id - The corporation identifier
   * @param {Boolean} options.showdeleted - Show deleted rows
   * @returns {Object} An object containing an array of corporation and a total items, a corporation info object.
   * @memberof CorporationsApiAdapter
   */
  async list(options) {
    const query = SQL`SELECT * FROM corporations`

    try {
      const filter = { exists: false }
      const tableName = 'corporations'
      options.id && addIdFilter(query, options, filter, tableName)
      addShowNotDeletedFilter(query, options, filter, tableName)
      const result = await this.mysql.query(query)
      return {
        totalItems: result[0].length,
        items: result[0]
      }
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    }
  }

  /**
   * Get corporation by id from corporations table
   *
   * @param {Object} options
   * @param {String} options.id - The corporation identifier
   * @param {Boolean} options.showdeleted - Show deleted rows
   * @param {String} options.errorMessageCode - error message code
   * @returns {Object} The new corporation object
   * @memberof CorporationsApiAdapter
   */
  async get({ id, showdeleted = false, errorMessageCode = null }) {
    if (!id) {
      throw new GenericServerError('Missing required parameters')
    }

    const { items } = await this.listCorporations({
      id,
      showdeleted
    })

    if (!showdeleted && items.length === 0) {
      const errorRes = Boom.notFound(`Cannot find corporation with id ${id}`)
      if (errorMessageCode) {
        errorRes.output.payload.messageCode = errorMessageCode
      }
      throw errorRes
    }

    return items[0]
  }

  /**
   * Add corporation data into corporations table
   *
   * @param {Object} options
   * @param {String} options.corporation.id - The corporation identifier
   * @param {String} options.corporation.name - The corporation name
   * @param {String} options.createdBy - The created by user identifier
   * @returns {Object} The new corporation object
   * @throws {GenericServerError}
   * @memberof CorporationsApiAdapter
   */
  async add({ corporation, createdBy }, connection = null) {
    const { id, name, licenseItemId } = corporation
    const query = generateQueryInsert('corporations', {
      id,
      name,
      licenseItemId,
      createdBy,
      updatedBy: createdBy
    })

    const notExistsConnection = !connection
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      await connection.query(query)
      notExistsConnection && (await connection.query('COMMIT'))
      return this.getCorporation({ id })
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      notExistsConnection && (await connection.query('ROLLBACK'))
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection.release()
    }
  }

  /**
   * Update corporation data
   *
   * @param {Object} options
   * @param {String} options.id - The corporation identifier
   * @param {String} options.name - The corporation name
   * @param {String} options.licenseItemId - The corporation licenseItemId
   * @param {String} options.updatedBy - The updated by user identifier
   * @param {Date} options.baseUpdatedAt - The reference date and time to determine whether the date and time have been updated.
   * @param {String} options.errorMessageCode - error message code
   * @returns {Object} The new corporation object
   * @memberof CorporationsApiAdapter
   */
  async update(
    { id, name, licenseItemId, updatedBy, baseUpdatedAt },
    connection = null
  ) {
    if (!id || !updatedBy) {
      throw new GenericServerError('Missing required parameters')
    }

    const query = SQL`
      ${generateQueryUpdateBase('corporations', {
        name,
        licenseItemId,
        updatedBy
      })}
      WHERE deletedAt IS NULL`

    const filter = { exists: true }
    addIdFilter(query, { id }, filter)
    baseUpdatedAt &&
      addColumnFilter(
        query,
        {
          column: 'updatedAt',
          value: baseUpdatedAt,
          comparison: '<'
        },
        filter
      )

    const notExistsConnection = !connection
    let result
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      result = await connection.query(query)
      if (result[0].affectedRows !== 1) {
        throw new EntityNotFoundError(`Cannot find corporation with id ${id}`)
      }
      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      notExistsConnection && (await connection.query('ROLLBACK'))
      if (e.name === 'EntityNotFound') {
        throw e
      }
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection.release()
    }
  }

  /**
   * Sync Corporation Data
   *
   * @param {Object} options
   * @param {String} options.id - The corporation identifier
   * @param {String} options.name - The corporation name
   * @param {String} options.licenseItemId - The corporation licenseItemId
   * @param {String} options.userId - The updater user identifier
   * @memberof CorporationsApiAdapter
   */
  async syncData({ id, name, licenseItemId, userId }) {
    if (!id || (!name && name !== '') || !userId) {
      throw new GenericServerError('Missing required parameters')
    }
    const corporation = await this.getCorporation({ id }).catch(() => null)
    if (corporation) {
      ;(corporation.name !== name ||
        corporation.licenseItemId !== licenseItemId) &&
        (await this.updateCorporation({
          id,
          name,
          licenseItemId,
          updatedBy: userId
        }))
    } else {
      await this.addCorporation({
        corporation: { id, name, licenseItemId },
        createdBy: userId
      })
    }
  }
}

module.exports = CorporationsApiAdapter
