// Copyright (c) 2025 NTT InfraNet
'use strict'

class DBConn {
  constructor(conn, count) {
    this.conn = conn
    this.stack = 0
    this.count = count
  }

  query(q) {
    return this.conn.query(q)
  }

  async transaction() {
    if (this.stack === 0) {
      await this.conn.query('START TRANSACTION')
    }
    this.stack++
  }

  async commit() {
    if (this.stack === 1) {
      await this.conn.query('COMMIT')
    }
    this.stack--
  }

  async rollback() {
    if (this.stack > 0) {
      await this.conn.query('ROLLBACK')
      this.stack = 0
    }
  }

  connect() {
    this.count++
  }

  release() {
    if (this.count === 0) {
      this.conn.release()
      this.conn = null
    } else {
      this.count--
    }
  }
}

const connect = async (mysql, connection) => {
  if (connection) {
    if (connection instanceof DBConn) {
      connection.connect()
    } else {
      // connection === mysql.getConnection()
      connection = new DBConn(connection, 1)
    }
  } else {
    connection = new DBConn(await mysql.getConnection(), 0)
  }
  return connection
}

module.exports = connect
