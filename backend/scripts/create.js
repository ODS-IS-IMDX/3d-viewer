// Copyright (c) 2025 NTT InfraNet
#!/usr/bin/env node

'use strict'

const mysql = require('mysql')
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
  const client = mysql.createConnection({
    host: getenv.string('EHV_CORE_MYSQL_HOST'),
    port: getenv.string('EHV_CORE_MYSQL_PORT'),
    password: getenv.string('EHV_CORE_MYSQL_PASSWORD'),
    user: getenv.string('EHV_CORE_MYSQL_USER'),
    database: 'mysql'
  })

  await client.connect()
  await client.query(
    `DROP DATABASE IF EXISTS ${getenv.string('EHV_CORE_MYSQL_DATABASE')}`
  )
  await client.query(
    `CREATE DATABASE ${getenv.string('EHV_CORE_MYSQL_DATABASE')}`
  )
  await client.end()

  console.log(
    '✔ Database'.green,
    getenv.string('EHV_CORE_MYSQL_DATABASE').bold.green,
    'created successfully!'.green
  ) // eslint-disable-line no-console
}

run().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
