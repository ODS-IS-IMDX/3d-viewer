// Copyright (c) 2025 NTT InfraNet
'use strict'

const SQL = require('@nearform/sql')

const { GenericServerError } = require('../../../lib/errors')
const connect = require('../../../lib/utils/db-connection')

/**
 * Cloud Database adapter to support liveness
 *
 * @class LivenessDbAdapter
 * @param {Object} options - An Object containing logger and database instances
 * @param {Object} options.mysql - The MySQL client instance
 * @param {Object} options.log - Logger instance
 * @version 1.0 Dublin
 * @since 1.0 Dublin
 */
class LivenessDbAdapter {
  constructor(options) {
    this.mysql = options.mysql
    this.log = options.log
  }

  /**
   * Issue a simple NoOp to check DB is readable
   *
   * @returns {Object} A empty object or error.
   * @memberof LivenessDbAdapter
   * @version 1.0 Dublin
   * @since 1.0 Dublin
   */
  async noOpDb() {
    const query = SQL`SELECT SQL_CALC_FOUND_ROWS users.* FROM users`
    let connection
    try {
      connection = await connect(this.mysql)
      await connection.query(query)
      return { status: 'ok' }
    } catch (e) {
      throw new GenericServerError(e.message)
    } finally {
      connection?.release()
    }
  }
}

module.exports = LivenessDbAdapter
