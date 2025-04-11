// Copyright (c) 2025 NTT InfraNet
#!/usr/bin/env node

'use strict'

const vault = require('../lib/vault/vault-iam-auth')
const Postgrator = require('postgrator')
const path = require('path')
const dotenv = require('dotenv')
const getenv = require('getenv')
require('colors')

// The ENV can be set using a .env file
if (getenv.string('EHV_ENV_FILE', '')) {
  dotenv.config({ path: getenv.string('EHV_ENV_FILE') })
} else {
  dotenv.config()
}

async function run () {
  const version = process.argv[2] || 'max'
  const migrationDirectory = path.join(__dirname, '/../migrations')
  const { username, password } = await credentials()

  const postgrator = new Postgrator({
    driver: 'mysql',
    migrationDirectory,
    schemaTable: `${getenv.string(
      'EHV_CORE_MYSQL_DATABASE'
    )}_schemaversion`,
    host: getenv.string('EHV_CORE_MYSQL_HOST'),
    port: getenv.string('EHV_CORE_MYSQL_PORT'),
    database: getenv.string('EHV_CORE_MYSQL_DATABASE'),
    user: getenv.string('EHV_CORE_MYSQL_USER', username),
    password: getenv.string('EHV_CORE_MYSQL_PASSWORD', password)
  })

  await postgrator.migrate(version)

  console.log(
    '✔ Database'.green,
    getenv.string('EHV_CORE_MYSQL_DATABASE').bold.green,
    'migrated successfully to version'.green,
    version.bold.red,
    '!'.green
  ) // eslint-disable-line no-console
}

async function credentials () {
  if (
    !getenv.string('EHV_CORE_MYSQL_USER', '') &&
    !getenv.string('EHV_CORE_MYSQL_PASSWORD', '')
  ) {
    const client = await vault({
      endpoint: getenv.string('VAULT_ADDR'),
      token: getenv.string('VAULT_TOKEN', ''),
      role: getenv.string('VAULT_DB_CREDENTIALS_ROLE', '')
    })
    return (await client.read(getenv.string('VAULT_DB_CREDENTIALS_PATH'))).data
  } else {
    return { username: '', password: '' }
  }
}

run().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
