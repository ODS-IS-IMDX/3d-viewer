// Copyright (c) 2025 NTT InfraNet
'use strict'

/**
 * Test adapters for cloud database
 * @module lib/test/cloud
 */

const path = require('path')
const fs = require('fs').promises
const Postgrator = require('postgrator')
const mysql = require('mysql2/promise')
const cfg = require('../../config')
const { getDatabaseCredentials } = require('../vault')

let connectionOptions
let dbCredentialsRefresh = false
const getConnectionOptions = async () => {
  if (connectionOptions && !dbCredentialsRefresh) {
    return connectionOptions
  }
  const config = await cfg()
  dbCredentialsRefresh =
    config.dbAdapter.cloud.vault &&
    config.dbAdapter.cloud.vault.dbCredentialsRefresh
  if (dbCredentialsRefresh) {
    await getDatabaseCredentials(
      config.dbAdapter.cloud.vault,
      config.dbAdapter.cloud
    )
  }
  connectionOptions = {
    host: config.dbAdapter.cloud.host,
    port: config.dbAdapter.cloud.port,
    password: config.dbAdapter.cloud.password,
    user: config.dbAdapter.cloud.user,
    database: config.dbAdapter.cloud.database
  }
  return connectionOptions
}
const migrationDirectory = path.join(__dirname, '../../migrations')
let fixturesDirectory =
  process.env.FIXTURES_FOLDER || path.join(__dirname, '../../fixtures/test/')

/**
 * テストデータフォルダを指定する
 * ※テストデータ投入後にresetFixturesDirectory()を呼出す事
 * @param {string} dirPath
 */
const setFixturesDirectory = dirPath => {
  fixturesDirectory = dirPath
}

/**
 * テストデータフォルダを規定値へリセットする
 */
const resetFixturesDirectory = () => {
  fixturesDirectory =
    process.env.FIXTURES_FOLDER || path.join(__dirname, '../../fixtures/test/')
}

/**
 * Create a db client for initialization
 * @returns {Object} A MySQL Client instance
 * @memberof lib/test/cloud
 */
const createClientForInit = async () => {
  const connectionOptions = await getConnectionOptions()
  const client = await mysql.createConnection(
    Object.assign({}, connectionOptions, { database: 'mysql' })
  )
  return client
}

/**
 * Create a db client for initialization
 * @returns {Object} A MySQL Client instance
 * @memberof lib/test/cloud
 */
const createClient = async () => {
  const connectionOptions = await getConnectionOptions()
  const client = await mysql.createConnection(connectionOptions)
  return client
}

/**
 * Drop and Recreate the MySQL database
 * @param {Object} - A MySQL Client instance
 * @memberof lib/test/cloud
 */
const createEmptyDb = async client => {
  const connectionOptions = await getConnectionOptions()
  await client.query(`DROP DATABASE IF EXISTS ${connectionOptions.database}`)
  await client.query(`CREATE DATABASE ${connectionOptions.database}`)
}

/**
 * Run database migrations
 * @memberof lib/test/cloud
 */
const migrateDb = async (target = 'max') => {
  const connectionOptions = await getConnectionOptions()
  const postgratorOptions = Object.assign({}, connectionOptions, {
    driver: 'mysql',
    migrationDirectory: migrationDirectory,
    schemaTable: `${connectionOptions.database}_schemaversion`
  })
  const postgrator = new Postgrator(postgratorOptions)
  await postgrator.migrate(target)

  const maxVer = await postgrator.getMaxVersion().catch(e => console.log(e))
  const dbVer = await postgrator.getDatabaseVersion().catch(e => console.log(e))
  console.log(
    `[MIGRATE-DB] max-version: ${maxVer}, target-version: ${
      target === 'max' ? maxVer : target
    }, latest-db-version: ${dbVer}`
  )
}

/**
 * Insert a fixture into the database
 *
 * @param {Object} client - The MySQL Client instance
 * @param {String} table - The table name
 * @param {Object} entry - The column names for the table
 * @memberof lib/test/cloud
 */
const insertFixture = (client, table, entry) => {
  const keys = Object.keys(entry)
  const values = Object.values(entry)

  const columns = keys.map(k => `\`${k}\``).join()
  const anchors = keys.map(_ => '?').join()

  const query = `INSERT INTO ${table} (${columns}) VALUES (${anchors})`

  return client.query(
    query,
    values.map(value =>
      value && typeof value === 'object' ? JSON.stringify(value) : value
    )
  )
}

/**
 * Read fixtures from JSON files
 * @param {Array} tables - A list of table fixtures to read
 * @returns {Array} An array of table objects
 * @memberof lib/test/cloud
 */
const readFixtures = tables => {
  return Promise.all(
    tables.map(table =>
      fs
        .readFile(path.join(fixturesDirectory, `${table}.json`), 'utf8')
        .then(data => JSON.parse(data))
    )
  )
}

/**
 * Reset the database and populate with one or more fixture tables. Used for testing.
 *
 * @param {Array} tables - A string array of tables to insert
 * @param {String} environment - Environment used in fixture files
 * @memberof lib/test/cloud
 */
const resetDb = async (tables, environment) => {
  const clientforInit = await createClientForInit()
  await createEmptyDb(clientforInit)
  await clientforInit.end()
  const client = await createClient()
  const connectionOptions = await getConnectionOptions()

  if (tables) {
    await migrateDb()
    const fixtures = await readFixtures(tables)

    await client.beginTransaction()
    await client.query(`USE ${connectionOptions.database}`)
    await client.query('SET FOREIGN_KEY_CHECKS=0')
    let index = 0
    for (const table of tables) {
      const fixture = fixtures[index++]
      for (const entry of fixture[environment] || fixture) {
        await insertFixture(client, table, entry)
      }
    }
    await client.query('SET FOREIGN_KEY_CHECKS=1')
    await client.commit()
  }

  await client.end()
}

/**
 * Deploys the DB to the latest version and apply fixtures if appropriate
 * @param {Object} options  Options configuring the method
 * @param {bool} options.flushDB Flag to recreate the DB
 * @param {bool} options.applyMigrations Flag to apply the migrations if required
 * @param {bool} options.applyFixtures Flag to apply fixtures if required
 * @param {Array} options.tables Array of tables to apply fixtures to
 * @param {String} environment The environment where it runs
 * @memberof lib/test/cloud
 */
const deployDb = async (options, environment) => {
  if (options.flushDb) {
    console.log('Flusing db') // eslint-disable-line no-console
    const clientForInit = await createClientForInit()
    await createEmptyDb(clientForInit)
    await clientForInit.end()
  }

  const client = await createClient()
  const connectionOptions = await getConnectionOptions()

  if (options.applyMigrations) {
    if (options.undoVersion) {
      console.log('applying undo migrations') // eslint-disable-line no-console
      await migrateDb(options.undoVersion)
    } else {
      console.log('applying migrations') // eslint-disable-line no-console
      await migrateDb()
    }
  }

  if (options.tables && options.applyFixtures) {
    console.log('applying fixtures') // eslint-disable-line no-console
    const fixtures = await readFixtures(options.tables)
    await client.beginTransaction()
    await client.query(`USE ${connectionOptions.database}`)
    await client.query('SET FOREIGN_KEY_CHECKS=0')
    let index = 0
    for (const table of options.tables) {
      const fixture = fixtures[index++]
      for (const entry of fixture[environment] || fixture) {
        await insertFixture(client, table, entry)
      }
    }
    await client.query('SET FOREIGN_KEY_CHECKS=1')
    await client.commit()
  }

  await client.end()
}

/**
 * Init table data
 *
 * @param {Array} tables - A string array of tables to insert
 * @param {String} environment - Environment used in fixture files
 * @memberof lib/test/cloud
 */
const initTables = async (tables, environment) => {
  if (!tables || !tables.length) return

  const client = await createClient()
  const connectionOptions = await getConnectionOptions()

  const fixtures = await readFixtures(tables)

  await client.beginTransaction()
  await client.query(`USE ${connectionOptions.database}`)
  await client.query('SET FOREIGN_KEY_CHECKS=0')
  let index = 0
  for (const table of tables) {
    await client.query(`TRUNCATE TABLE ${table}`)
    const fixture = fixtures[index++]
    for (const entry of fixture[environment] || fixture) {
      await insertFixture(client, table, entry)
    }
  }
  await client.query('SET FOREIGN_KEY_CHECKS=1')
  await client.commit()

  await client.end()
}

const GENERAL_LOCATION = {
  lat: 35.0,
  lng: 135.0,
  zoom: 17,
  bounds: { left: 134.9, bottom: 34.9, right: 135.1, top: 35.1 }
}
const GENERAL_USER_ID = 'user-0000-0000-0000-general'
const DELETED_USER_ID = 'user-0000-0000-0000-deleted'
const ASSET_USER_ID = 'user-0000-0000-0000-asset'
const GENERAL_CORPORATION_ID = 'corporation-0000-0000-0000-general'
const DELETED_CORPORATION_ID = 'corporation-0000-0000-0000-deleted'
const ASSET_CORPORATION_ID = 'corporation-0000-0000-0000-asset'
const GENERAL_CONTENT_ID = 'content-0000-0000-0000-general'
const DELETED_CONTENT_ID = 'content-0000-0000-0000-deleted'
const ASSET_CONTENT_ID = 'content-0000-0000-0000-asset'
const ADMIN_USER_ID = 'user-9999-9999-9999-admin'

module.exports = {
  createClient,
  createEmptyDb,
  migrateDb,
  insertFixture,
  readFixtures,
  resetDb,
  deployDb,
  initTables,
  setFixturesDirectory,
  resetFixturesDirectory,
  GENERAL_LOCATION,
  GENERAL_USER_ID,
  DELETED_USER_ID,
  ASSET_USER_ID,
  GENERAL_CORPORATION_ID,
  DELETED_CORPORATION_ID,
  ASSET_CORPORATION_ID,
  GENERAL_CONTENT_ID,
  DELETED_CONTENT_ID,
  ASSET_CONTENT_ID,
  ADMIN_USER_ID
}
