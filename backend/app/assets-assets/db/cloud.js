// Copyright (c) 2025 NTT InfraNet
'use strict'

const SQL = require('@nearform/sql')
const Boom = require('@hapi/boom')

const {
  GenericServerError,
  EntityNotFoundError
} = require('../../../lib/errors')

const { mapAssetsAssetsFromDb } = require('./map-assets-assets-from-db')

const {
  addIdFilter,
  addSiteIdFilter,
  addColumnFilter,
  addShowNotDeletedFilter,
  addPaginationFilter,
  generateQueryInsert
} = require('../../../lib/utils/db-filters')

const { getUuid } = require('../../../lib/utils/uuid')
const { convertDataToSQLParam } = require('../../../lib/utils/convert')
const { generateMessage } = require('../../../lib/utils/generate-message')
const { LOG_ERROR } = require('../../../lib/constants')

/**
 * Cloud Database adapter to support assets-assets
 *
 * @class AssetsAssetsDbCloudAdapter
 * @param {Object} options - An Object containing logger and database instances
 * @param {Object} options.mysql - The MySQL client instance
 * @param {Object} options.fastify - The Fastify instance
 * @param {Object} options.log - Logger instance
 */
class AssetsAssetsDbCloudAdapter {
  constructor(options) {
    this.mysql = options.mysql
    this.log = options.log
    this.fastify = options.fastify
  }

  /**
   * Get a list of assets-assets
   *
   * @param {Object} options
   * @param {String} options.id - The assets-assets identifier
   * @param {String} options.siteId - The site identifier
   * @param {String|Array} options.assetId - The asset identifier
   * @param {String|Array} options.linkedAssetId - The linked asset identifier
   * @param {String|Array} options.type - The assets-assets type
   * @param {String} options.sort - Sort by createdAt, updatedAt or deletedAt
   * @param {String} options.direction - Sort direction (ASC,DESC)
   * @param {number} options.limit - Row limit for pagination
   * @param {number} options.offset - Row offset for pagination
   * @param {Boolean} options.showdeleted - Show deleted rows
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} An object containing an array of assets-assets and a total items.
   * @memberof AssetsAssetsDbCloudAdapter
   */
  async list(
    {
      id,
      siteId,
      assetId,
      linkedAssetId,
      type,
      sort,
      direction,
      limit,
      offset,
      showdeleted
    },
    connection = null
  ) {
    const notExistsConnection = !connection
    try {
      const query = SQL`
        FROM
          assets_assets as aa
            LEFT JOIN users as uc ON aa.createdBy = uc.id
            LEFT JOIN users as uu ON aa.updatedBy = uu.id`

      const filter = { exists: false }
      id && addIdFilter(query, { id }, filter, 'aa')
      addSiteIdFilter(query, { siteId }, filter, 'aa')
      assetId &&
        assetId.length &&
        addColumnFilter(
          query,
          {
            column: 'assetId',
            value: assetId
          },
          filter,
          'aa'
        )
      linkedAssetId &&
        linkedAssetId.length &&
        addColumnFilter(
          query,
          {
            column: 'linkedAssetId',
            value: linkedAssetId
          },
          filter,
          'aa'
        )
      type &&
        type.length &&
        addColumnFilter(
          query,
          {
            column: 'type',
            value: type
          },
          filter,
          'aa'
        )
      addShowNotDeletedFilter(query, { showdeleted }, filter, 'aa')

      const getDataQuery = SQL`
        SELECT
          aa.id,
          aa.siteId,
          aa.assetId,
          aa.linkedAssetId,
          aa.type,
          uc.firstName as cFirstName,
          uc.lastName as cLastName,
          aa.createdBy,
          aa.createdAt,
          uu.firstName as uFirstName,
          uu.lastName as uLastName,
          aa.updatedBy,
          aa.updatedAt,
          aa.deletedAt
        ${query}
      `
      addPaginationFilter(
        getDataQuery,
        { sort, direction, limit, offset },
        'cm'
      )

      const getTotalQuery = SQL`
        SELECT
          COUNT(aa.id) as totalItems
        ${query}
      `

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      const result = await connection.query(getDataQuery)
      const [[{ totalItems }]] = await connection.query(getTotalQuery)

      return {
        items: result[0].map(mapAssetsAssetsFromDb),
        totalItems
      }
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Get a list of assets-assets plus assets data
   *
   * @param {Object} options
   * @param {String} options.id - The assets-assets identifier
   * @param {String} options.siteId - The site identifier
   * @param {String|Array} options.assetId - The asset identifier
   * @param {String|Array} options.linkedAssetId - The linked asset identifier
   * @param {String|Array} options.type - The assets-assets type
   * @param {String} options.sort - Sort by createdAt, updatedAt or deletedAt
   * @param {String} options.direction - Sort direction (ASC,DESC)
   * @param {number} options.limit - Row limit for pagination
   * @param {number} options.offset - Row offset for pagination
   * @param {Boolean} options.showdeleted - Show deleted rows
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} An object containing an array of assets-assets and a total items.
   * @memberof AssetsAssetsDbCloudAdapter
   */
  async listJoinAssets(
    {
      id,
      siteId,
      assetId,
      linkedAssetId,
      type,
      sort,
      direction,
      limit,
      offset,
      showdeleted
    },
    connection = null
  ) {
    const notExistsConnection = !connection
    try {
      const query = SQL`
        FROM
          assets_assets as aa
            INNER JOIN assets as a1 ON aa.assetId = a1.id
            INNER JOIN assets as a2 ON aa.linkedAssetId = a2.id
            LEFT JOIN users as uc ON aa.createdBy = uc.id
            LEFT JOIN users as uu ON aa.updatedBy = uu.id`

      const filter = { exists: false }
      id && addIdFilter(query, { id }, filter, 'aa')
      addSiteIdFilter(query, { siteId }, filter, 'aa')
      addSiteIdFilter(query, { siteId }, filter, 'a1')
      addSiteIdFilter(query, { siteId }, filter, 'a2')
      assetId &&
        assetId.length &&
        addColumnFilter(
          query,
          {
            column: 'assetId',
            value: assetId
          },
          filter,
          'aa'
        )
      linkedAssetId &&
        linkedAssetId.length &&
        addColumnFilter(
          query,
          {
            column: 'linkedAssetId',
            value: linkedAssetId
          },
          filter,
          'aa'
        )
      type &&
        type.length &&
        addColumnFilter(
          query,
          {
            column: 'type',
            value: type
          },
          filter,
          'aa'
        )
      addShowNotDeletedFilter(query, { showdeleted }, filter, 'aa')
      addShowNotDeletedFilter(query, { showdeleted }, filter, 'a1')
      addShowNotDeletedFilter(query, { showdeleted }, filter, 'a2')

      const getDataQuery = SQL`
        SELECT
          aa.id,
          aa.siteId,
          aa.assetId,
          a1.ionAssetId as baseIonAssetId,
          a1.fileStorageNodeId as baseFileStorageNodeId,
          a1.conversionOperationId as baseConversionOperationId,
          a1.name as baseName,
          a1.displayName as baseDisplayName,
          a1.status as baseStatus,
          a1.category as baseCategory,
          a1.formatType as baseFormatType,
          a1.customPosition as baseCustomPosition,
          a1.ionType as baseIonType,
          a1.ionSourceType as baseIonSourceType,
          a1.isMeasurement as baseIsMeasurement,
          a1.startDateTime as baseStartDateTime,
          a1.endDateTime as baseEndDateTime,
          a1.cesiumOptions as baseCesiumOptions,
          aa.linkedAssetId,
          a2.ionAssetId as linkedIonAssetId,
          a2.fileStorageNodeId as linkedFileStorageNodeId,
          a2.conversionOperationId as linkedConversionOperationId,
          a2.name as linkedName,
          a2.displayName as linkedDisplayName,
          a2.status as linkedStatus,
          a2.category as linkedCategory,
          a2.formatType as linkedFormatType,
          a2.customPosition as linkedCustomPosition,
          a2.ionType as linkedIonType,
          a2.ionSourceType as linkedIonSourceType,
          a2.isMeasurement as linkedIsMeasurement,
          a2.startDateTime as linkedStartDateTime,
          a2.endDateTime as linkedEndDateTime,
          a2.cesiumOptions as linkedCesiumOptions,
          aa.type,
          uc.firstName as cFirstName,
          uc.lastName as cLastName,
          aa.createdBy,
          aa.createdAt,
          uu.firstName as uFirstName,
          uu.lastName as uLastName,
          aa.updatedBy,
          aa.updatedAt,
          aa.deletedAt
        ${query}
      `
      addPaginationFilter(
        getDataQuery,
        { sort, direction, limit, offset },
        'cm'
      )

      const getTotalQuery = SQL`
        SELECT
          COUNT(aa.id) as totalItems
        ${query}
      `

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      const result = await connection.query(getDataQuery)
      const [[{ totalItems }]] = await connection.query(getTotalQuery)

      return {
        items: result[0].map(mapAssetsAssetsFromDb),
        totalItems
      }
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Get assets-assets by id
   *
   * @param {Object} options
   * @param {String} options.id - The assets-assets identifier
   * @param {String} options.siteId - The site identifier
   * @param {String} options.assetId - The asset identifier
   * @param {String} options.linkedAssetId - The linked asset identifier
   * @param {String} options.type - The assets-assets type
   * @param {Boolean} options.isPlusAsset - Plus asset data
   * @param {Boolean} options.showdeleted - Show deleted rows
   * @param {String} options.errorMessageCode - error message code
   * @returns {Object} A assets-assets object
   * @throws {NotFoundError}
   * @throws {GenericServerError}
   * @memberof AssetsAssetsDbCloudAdapter
   */
  async get(
    {
      id,
      siteId,
      assetId,
      linkedAssetId,
      type,
      isPlusAsset = false,
      showdeleted = false,
      errorMessageCode = null
    },
    connection = null
  ) {
    if (!siteId || (!id && (!assetId || !linkedAssetId))) {
      throw new GenericServerError('Missing required parameters')
    }

    const { items } = isPlusAsset
      ? await this.listJoinAssets(
          {
            id,
            siteId,
            assetId,
            linkedAssetId,
            type,
            showdeleted
          },
          connection
        )
      : await this.list(
          {
            id,
            siteId,
            assetId,
            linkedAssetId,
            type,
            showdeleted
          },
          connection
        )

    if (!showdeleted && items.length === 0) {
      const addMessage = generateMessage({ id, siteId, assetId, linkedAssetId })
      const errorRes = Boom.notFound(
        `Cannot find assets-assets with ${addMessage}`
      )
      if (errorMessageCode) {
        errorRes.output.payload.messageCode = errorMessageCode
      }
      throw errorRes
    }

    return items[0]
  }

  /**
   * Add assets-assets data
   *
   * @param {Object} options
   * @param {String} options.siteId - The site identifier
   * @param {String} options.assetId - The asset identifier
   * @param {String} options.linkedAssetId - The linked asset identifier
   * @param {String} options.type - The assets-assets type
   * @param {String} options.userId - The user identifier
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} The new assets-assets object
   * @throws {GenericServerError}
   * @memberof AssetsAssetsDbCloudAdapter
   */
  async add(
    { siteId, assetId, linkedAssetId, type, userId },
    connection = null
  ) {
    const id = getUuid()
    const query = generateQueryInsert('assets_assets', {
      id,
      siteId,
      assetId,
      linkedAssetId,
      type,
      createdBy: userId,
      updatedBy: userId
    })

    const notExistsConnection = !connection
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      await connection.query(query)
      notExistsConnection && (await connection.query('COMMIT'))
      return this.get({ id, siteId }, connection)
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      notExistsConnection && (await connection.query('ROLLBACK'))
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Delete assets-assets data
   *
   * @param {Object} options
   * @param {String|Array} options.id - The assets-assets identifier
   * @param {String} options.siteId - The site identifier
   * @param {String|Array} options.assetId - The asset identifier
   * @param {String|Array} options.linkedAssetId - The linked asset identifier
   * @param {String|Array} options.type - The assets-assets type
   * @param {String} options.userId - The user identifier
   * @param {Boolean} options.purge - True for hard delete, False for soft deletion.
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {EntityNotFoundError}
   * @throws {GenericServerError}
   * @memberof AssetsAssetsDbCloudAdapter
   */
  async delete(
    { id, siteId, assetId, linkedAssetId, type, userId, purge = false },
    connection = null
  ) {
    if (
      !id &&
      !siteId &&
      (!assetId || !assetId.length) &&
      (!linkedAssetId || !linkedAssetId.length)
    ) {
      throw new GenericServerError('All assets-assets cannot be deleted')
    }

    let query
    const filter = { exists: false }
    if (purge) {
      query = SQL`DELETE FROM assets_assets `
    } else {
      query = SQL`UPDATE assets_assets SET updatedBy=${userId}, updatedAt=now(), deletedAt=now() WHERE deletedAt IS NULL `
      filter.exists = true
    }

    id &&
      id.length &&
      addColumnFilter(
        query,
        {
          column: 'id',
          value: id
        },
        filter
      )
    siteId && addSiteIdFilter(query, { siteId }, filter)
    assetId &&
      assetId.length &&
      addColumnFilter(
        query,
        {
          column: 'assetId',
          value: assetId
        },
        filter
      )
    linkedAssetId &&
      linkedAssetId.length &&
      addColumnFilter(
        query,
        {
          column: 'linkedAssetId',
          value: linkedAssetId
        },
        filter
      )
    type &&
      type.length &&
      addColumnFilter(
        query,
        {
          column: 'type',
          value: type
        },
        filter
      )

    const notExistsConnection = !connection
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      const result = await connection.query(query)
      if (result[0].affectedRows === 0) {
        const addMessage = generateMessage({
          id,
          siteId,
          assetId,
          linkedAssetId
        })
        throw new EntityNotFoundError(
          `Cannot find assets-assets with ${addMessage}`
        )
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
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Bulk insert assets-assets data
   *
   * @param {Array} records - Target data
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @memberof AssetsAssetsDbCloudAdapter
   */
  async bulkInsert(records, connection = null) {
    if (!records.length) {
      return
    }

    const notExistsConnection = !connection
    try {
      const columns = Object.keys(records[0])
      const query = SQL`
      INSERT IGNORE INTO assets_assets
      ( ${SQL.unsafe(columns.map(c => `\`${c}\``).join(', '))} )
      VALUES
      ( ${SQL.glue(
        records.map(r =>
          SQL.glue(
            columns.map(c => SQL`${convertDataToSQLParam(r[c])}`),
            ', '
          )
        ),
        ` ),
          ( `
      )} )`

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      await connection.query(query)
      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      notExistsConnection && (await connection.query('ROLLBACK'))
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }
}

module.exports = AssetsAssetsDbCloudAdapter
