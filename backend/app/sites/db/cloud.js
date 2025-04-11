// Copyright (c) 2025 NTT InfraNet
'use strict'

const SQL = require('@nearform/sql')
const utilNotification = require('../../../lib/utils/notification')

const {
  GenericServerError,
  EntityNotFoundError
} = require('../../../lib/errors')

const mapSiteFromDb = require('./map-sites-from-db')
const {
  addIdFilter,
  addPaginationFilter,
  addShowNotDeletedFilter,
  addColumnFilter
} = require('../../../lib/utils/db-filters')
const connect = require('../../../lib/utils/db-connection')

const {
  // generateToken,
  deleteToken
} = require('../../../lib/external/cesium-ion-api')
const { LOG_ERROR } = require('../../../lib/constants')

/**
 * Cloud Database adapter to support Sites
 *
 * @class SitesDbCloudAdapter
 * @param {Object} options - An Object containing logger and database instances
 * @param {Object} options.mysql - The MySQL client instance
 * @param {Object} options.log - Logger instance
 */
class SitesDbCloudAdapter {
  constructor(options) {
    this.mysql = options.mysql
    this.log = options.log
    this.fastify = options.fastify
  }

  /**
   * Get site permission
   *
   * @param {Object} options
   * @param {String} options.siteId - The site identifier
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Array} An object containing an array of site objects
   * @memberof SitesDbCloudAdapter
   */
  async getPermission(id, connection = null) {
    const query = SQL`SELECT corporationId FROM contents WHERE id = ${id}`

    const result = (
      await (connection || this.mysql).query(query).catch(e => {
        throw GenericServerError(e.message)
      })
    )[0]
    if (result.length === 0) {
      throw new EntityNotFoundError(`Cannot find site with id ${id}`)
    }

    return result[0].corporationId
  }

  /**
   * Get a list of sites
   *
   * @param {Object} options
   * @param {Array} options.ids - The site identifier
   * @param {String} options.sort - Sort by createdAt, updatedAt or deletedAt
   * @param {String} options.direction - Sort direction (ASC,DSC)
   * @param {number} options.limit - Row limit for pagination
   * @param {number} options.offset - Row offset for pagination
   * @param {Boolean} options.showdeleted - Show deleted rows
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} An object containing an array of site objects and a total count.
   * @memberof SitesDbCloudAdapter
   */
  async list(
    { ids, sort, direction, limit, offset, showdeleted },
    connection = null
  ) {
    const query = SQL`FROM contents`

    const filter = { exists: false }
    ids?.length && addColumnFilter(query, { column: 'id', value: ids }, filter)
    addShowNotDeletedFilter(query, { showdeleted }, filter)

    const getDataQuery = SQL`SELECT * ${query}`
    addPaginationFilter(query, { sort, direction, limit, offset })

    const getTotalQuery = SQL`SELECT COUNT(id) AS totalItems ${query}`

    try {
      connection = await connect(this.mysql, connection)
      const result = await connection.query(getDataQuery)
      const [[{ totalItems }]] = await connection.query(getTotalQuery)
      return {
        items: result[0].map(mapSiteFromDb),
        totalItems
      }
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      connection?.release()
    }
  }

  /**
   * Get a specific site by id
   *
   * @param {Object} options
   * @param {String} options.id - The site identifier
   * @param {Boolean} [options.viewStructure] - Get viewStructure
   * @param {Boolean} [options.showdeleted] - Show deleted rows
   * @param {Object} [connection] - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} A site object
   * @throws {EntityNotFoundError} Cannot find user with id
   * @memberof SitesDbCloudAdapter
   */
  async get(options, connection = null) {
    const query = SQL`
      SELECT s.*, c.location
      FROM contents AS s
      LEFT JOIN corporations AS c ON s.corporationId = c.id`

    const filter = { exists: false }
    addIdFilter(query, options, filter, 's')
    addShowNotDeletedFilter(query, options, filter, 's')

    try {
      connection = await connect(this.mysql, connection)

      const result = await connection.query(query)
      if (result[0].length === 0) {
        throw new EntityNotFoundError(`Cannot find site with id ${options.id}`)
      }

      const ret = mapSiteFromDb(result[0][0])
      if (options.viewStructure) {
        ret.viewStructure = await this.fastify.dbAdapters.assets.getViewStructure(
          options,
          connection
        )
      }

      return ret
    } finally {
      connection?.release()
    }
  }

  /**
   * Get a default corporation site
   *
   * @param {Object} options
   * @param {Array} options.corporationId - The corporation identifier
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} A site object
   * @memberof SitesDbCloudAdapter
   */
  async getCorporation({ corporationId }, connection = null) {
    const query = SQL`
      SELECT id, name
      FROM contents`

    const filter = { exists: false }
    addColumnFilter(
      query,
      { column: 'corporationId', value: corporationId },
      filter
    )
    addShowNotDeletedFilter(query, {}, filter)
    addPaginationFilter(query, {
      sort: 'createdAt',
      direction: 'asc',
      limit: 1
    })

    const result = await (connection || this.mysql).query(query)
    if (result[0].length === 0) {
      throw new EntityNotFoundError(
        `Cannot find site with corporation id ${corporationId}`
      )
    }

    return result[0][0]
  }

  /**
   * Add a site
   *
   * @param {Object} options
   * @param {String} options.userId - The user identifier
   * @param {Object} options.siteId - The site identifier
   * @param {Object} options.corporationId - The corporation identifier
   * @param {String} options.name - The site name
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} The new site object
   * @throws {GenericServerError}
   * @memberof SitesDbCloudAdapter
   */
  async add({ userId, siteId, corporationId, name }, connection = null) {
    const id = siteId

    const command = SQL`INSERT INTO contents (id, corporationId, createdBy, updatedBy`

    name && command.append(SQL`, name`)
    command.append(SQL`) VALUES (`)
    command.append(SQL`${id},`)
    command.append(SQL`${corporationId},`)
    command.append(SQL`${JSON.stringify(userId)},`)
    command.append(SQL`${JSON.stringify(userId)}`)
    name && command.append(SQL`, ${name}`)
    command.append(SQL`)`)

    try {
      connection = await connect(this.mysql, connection)
      await connection.transaction()
      await connection.query(command)
      await connection.commit()

      return this.get({ id }, connection)
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      await connection?.rollback()
      throw new GenericServerError(e.message)
    } finally {
      connection?.release()
    }
  }

  /**
   * Update a site
   *
   * @param {Object} options
   * @param {String} options.id - The site identifier
   * @param {String} options.name - The site name
   * @param {Object} options.viewStructure - The site ui data
   * @param {String} options.cesiumIonTokenId - The cesium ion token identifier
   * @param {String} options.cesiumIonTokenValue - The cesium ion token
   * @param {String} options.userId - The user identifier
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {EntityNotFoundError}
   * @throws {GenericServerError}
   * @memberof SitesDbCloudAdapter
   */
  async update(
    {
      id,
      name = '',
      cesiumIonTokenId = '',
      cesiumIonTokenValue = '',
      userId,
      corporationId
    },
    connection = null
  ) {
    const query = SQL`UPDATE contents SET `

    const updates = []
    name && updates.push(SQL`name=${name}`)
    cesiumIonTokenId && updates.push(SQL`cesiumIonTokenId=${cesiumIonTokenId}`)
    cesiumIonTokenValue &&
      updates.push(SQL`cesiumIonTokenValue=${cesiumIonTokenValue}`)
    updates.push(SQL`updatedBy=${userId}`)
    updates.push(SQL`updatedAt=now()`)

    query.append(query.glue(updates, ', '))
    query.append(SQL`WHERE deletedAt IS NULL`)

    addIdFilter(query, { id }, { exists: true })

    try {
      connection = await connect(this.mysql, connection)
      await connection.transaction()

      const result = await connection.query(query)
      if (result[0].affectedRows !== 1) {
        throw new EntityNotFoundError(`Cannot find site with id ${id}`)
      }

      await connection.commit()
    } catch (e) {
      await connection?.rollback()
      if (e.name === 'EntityNotFound' || e.isBoom) {
        throw e
      }
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      connection?.release()
    }
  }

  /**
   * Delete a site
   *
   * @param {Object} options
   * @param {String} options.id - The site identifier
   * @param {String} options.userId - The user identifier
   * @param {Boolean} options.purge - True for hard delete, False for soft deletion.
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof SitesDbCloudAdapter
   */
  async delete(options, connection = null) {
    const { id, userId, purge = false } = options

    const tokenIds = await this.getCesiumIonTokenIds({ id })
    tokenIds?.length &&
      (await Promise.all(
        tokenIds.map(tokenId =>
          deleteToken({
            baseUrl: this.fastify.config.cesiumIon.url,
            accessToken: this.fastify.config.cesiumIon.token,
            tokenId
          }).catch(e => {
            if (e.output.statusCode !== 404) {
              throw e
            }
          })
        )
      ))

    let query
    if (purge) {
      query = SQL`DELETE FROM contents`
      addIdFilter(query, options, { exists: false })
    } else {
      query = SQL`
        UPDATE contents
        SET
          viewStructure=null,
          cesiumIonTokenId=null,
          cesiumIonTokenValue=null,
          updatedBy=${userId},
          updatedAt=now(),
          deletedAt=now()
        WHERE
          deletedAt IS NULL`
      addIdFilter(query, options, { exists: true })
    }

    try {
      connection = await connect(this.mysql, connection)
      await connection.transaction()

      const result = await connection.query(query)
      if (result[0].affectedRows !== 1) {
        throw new EntityNotFoundError(`Cannot find site with id ${id}`)
      }
      if (!purge) {
        await this.fastify.dbAdapters.assets
          .deleteBySiteId({ siteId: id, userId }, connection)
          .catch(e => {
            if (
              e.name !== 'EntityNotFound' &&
              e.isBoom &&
              e.output.statusCode !== 404
            ) {
              throw e
            }
          })
      }

      await connection.commit()
    } catch (e) {
      await connection?.rollback()
      if (Array.isArray(e)) {
        e.forEach(e => this.log.error(e))
        throw new GenericServerError(e[0].message)
      }
      throw e
    } finally {
      connection?.release()
    }
  }

  /**
   * Get cesium ion token id list by site
   *
   * @param {Object} options
   * @param {String} options.id - The site identifier
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof SitesDbCloudAdapter
   */
  async getCesiumIonTokenIds({ id }) {
    const tokenIds = await Promise.all([
      this.get({ id }).then(site => site.cesiumIonTokenId)
    ])
    return tokenIds.filter(tokenId => tokenId)
  }

  /**
   * Notification function using websocket
   *
   * @param {Object} options
   * @param {String} [options.code] - Message code
   * @param {String} [options.siteId] - The site identifier
   * @param {String} [options.userId] - The user identifier
   * @memberof SitesDbCloudAdapter
   */
  async notification({ code, siteId, userId }) {
    const site = await this.get({
      id: siteId,
      showdeleted: true
    })
    const user = await this.fastify.dbAdapters.users.get({ id: userId })
    const opts = { ...this.fastify.config.websocket, log: this.log }
    await utilNotification(
      JSON.stringify({
        messageCode: code,
        type: 'site',
        siteId: site.id,
        targetName: site.name,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        updatedAt: site.updatedAt
      }),
      opts
    )
  }
}

module.exports = SitesDbCloudAdapter
