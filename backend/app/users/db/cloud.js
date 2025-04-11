// Copyright (c) 2025 NTT InfraNet
'use strict'

const SQL = require('@nearform/sql')

const {
  GenericServerError,
  EntityDuplicationError,
  EntityNotFoundError
} = require('../../../lib/errors')

const mapUserFromDb = require('./map-users-from-db')
const {
  addIdFilter,
  addDateFilter,
  addColumnFilter,
  addPaginationFilter,
  addShowNotDeletedFilter,
  generateQueryInsert,
  generateQueryUpdateBase
} = require('../../../lib/utils/db-filters')
const connect = require('../../../lib/utils/db-connection')

const { generateMessage } = require('../../../lib/utils/generate-message')
const { LOG_ERROR } = require('../../../lib/constants')

/**
 * Cloud Database adapter to support User Accounts
 *
 * @class UsersDbAdapter
 * @param {Object} options - An Object containing logger and database instances
 * @param {Object} options.mysql - The MySQL client instance
 * @param {Object} options.fastify - The Fastify instance
 * @param {Object} options.log - Logger instance
 */
class UsersDbAdapter {
  constructor(options) {
    this.mysql = options.mysql
    this.log = options.log
    this.fastify = options.fastify
  }

  /**
   * Get a list of user accounts
   *
   * @param {Object} options
   * @param {String|Array} [options.id] - The user identifier
   * @param {String|Array} [options.loginUserId] - The login user identifier
   * @param {String|Array} [options.email] - The email address for the user account
   * @param {String} [options.sort] - Sort by createdAt, updatedAt or deletedAt
   * @param {String} [options.direction] - Sort direction (ASC,DSC)
   * @param {number} [options.offset] - Row offset for pagination
   * @param {number} [options.limit] - Row limit for pagination
   * @param {String} [options.created] - The created at timestamp string
   * @param {String} [options.updated] - The updated at timestamp string
   * @param {String} [options.deleted] - The deleted at timestamp string
   * @returns {Object} An object containing an array of user accounts and a total items.
   * @memberof UsersDbAdapter
   */
  async list(options, connection = null) {
    const whereColumns = {
      id: options.id,
      loginUserId: options.loginUserId,
      email: options.email
    }
    try {
      const query = SQL`
        FROM
          users as u
            LEFT JOIN corporations as c ON u.corporationId = c.id
      `

      const filter = { exists: false }
      for (const [column, value] of Object.entries(whereColumns)) {
        value &&
          value.length &&
          addColumnFilter(
            query,
            {
              column,
              value
            },
            filter,
            'u'
          )
      }
      addDateFilter(query, options, filter, 'u')
      addShowNotDeletedFilter(query, options, filter, 'u')

      const getDataQuery = SQL`
        SELECT
          u.id,
          u.loginUserId,
          u.corporationId,
          u.licenseItemIdList,
          u.email,
          u.firstName,
          u.lastName,
          u.title,
          u.phone,
          u.company,
          u.timezone,
          u.language,
          u.disabled,
          u.firstLogin,
          u.createdAt,
          u.updatedAt,
          u.deletedAt,
          c.name as corporationName
        ${query}
      `
      addPaginationFilter(getDataQuery, options, 'u')

      const getTotalQuery = SQL`SELECT COUNT(u.id) AS totalItems ${query}`

      connection = await connect(this.mysql, connection)
      const result = await connection.query(getDataQuery)
      const [[{ totalItems }]] = await connection.query(getTotalQuery)

      return {
        items: result[0].map(mapUserFromDb),
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
   * Get a specific user account by id
   *
   * @param {Object} options
   * @param {String} options.id - The user identifier in DB
   * @param {String} options.loginUserId - The login user identifier
   * @param {String} options.email - The email address for the user account
   * @param {Boolean} [options.showDeleted] - Show deleted rows
   * @param {Object} [connection] - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} A user account object
   * @throws {EntityNotFoundError} Cannot find user with id
   * @memberof UsersDbAdapter
   */
  async get(options, connection) {
    const { id, loginUserId, email, showdeleted } = options
    if (!id && !loginUserId && !email) {
      throw new GenericServerError('Missing required parameters')
    }

    const { items } = await this.list(
      {
        id,
        loginUserId,
        email,
        showdeleted
      },
      connection
    )

    if (!showdeleted && items.length === 0) {
      const addMessage = generateMessage({ id, loginUserId })
      throw EntityNotFoundError(`Cannot find user with ${addMessage}`)
    }

    return items[0]
  }

  /**
   * Add a new user account
   *
   * @param {Object} options
   * @param {String} options.id - User recode identifier
   * @param {String} options.loginUserId - User account identifier
   * @param {String} options.corporationId - User corporation identifier
   * @param {String} options.email User email address
   * @param {String} options.firstName User first name
   * @param {String} options.lastName User last name
   * @param {String} options.title User title
   * @param {String} options.phone User phone number
   * @param {String} options.company User company
   * @param {String} options.timezone User timezone
   * @param {String} options.language User language
   * @param {String} options.firstLogin User first login datetime
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} The newly created user account object
   * @throws {EntityDuplicationError} This user account already exists
   * @throws {GenericServerError} An unexpected server error occurred
   * @memberof UsersDbAdapter
   */
  async add(options, connection = null) {
    const query = generateQueryInsert('users', options)

    try {
      connection = await connect(this.mysql, connection)
      await connection.transaction()
      await connection.query(query)
      await connection.commit()

      return this.get({ id: options.id }, connection)
    } catch (e) {
      await connection?.rollback()
      if (e.code === 'ER_DUP_ENTRY') {
        throw new EntityDuplicationError(e.message)
      }
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      connection?.release()
    }
  }

  /**
   * Update a user account
   *
   * @param {Object} options
   * @param {String} options.id - The user recode identifier
   * @param {String} options.loginUserId - The user account identifier
   * @param {String} options.corporationId - The user corporation identifier
   * @param {String} options.email - The user's email
   * @param {String} options.firstName - The user account first name
   * @param {String} options.lastName - The user account last name
   * @param {String} options.title - The user account honorific title
   * @param {String} options.phone - The user account phone number
   * @param {String} options.company - The user account company
   * @param {String} options.timezone - The user account timezone
   * @param {String} options.language - The user account language
   * @param {String} options.disabled - The user account disabled
   * @param {String} options.firstLogin - The user account first login
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError} An unexpected server error occurred
   * @throws {EntityNotFoundError} Cannot find user with id
   * @memberof UsersDbAdapter
   */
  async update(
    {
      id,
      loginUserId,
      corporationId,
      email,
      firstName,
      lastName,
      title,
      phone,
      company,
      timezone,
      language,
      disabled,
      firstLogin
    },
    connection = null
  ) {
    if (!id && !email) {
      throw new GenericServerError('Missing required parameters')
    }

    const query = SQL`
      ${generateQueryUpdateBase('users', {
        loginUserId,
        corporationId,
        email,
        firstName,
        lastName,
        title,
        phone,
        company,
        timezone,
        language,
        disabled,
        firstLogin
      })}
      WHERE deletedAt IS NULL`

    addIdFilter(query, { id }, { exists: true })

    try {
      connection = await connect(this.mysql, connection)
      await connection.transaction()

      const result = await connection.query(query)
      if (result[0].affectedRows !== 1) {
        const addMessage = generateMessage({ id, email })
        throw new EntityNotFoundError(`Cannot find users with ${addMessage}`)
      }

      await connection.commit()

      return this.get({ id, email }, connection)
    } catch (e) {
      await connection?.rollback()
      if (e.name === 'EntityNotFound') {
        throw e
      }
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      connection?.release()
    }
  }
}

module.exports = UsersDbAdapter
