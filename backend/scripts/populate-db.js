// Copyright (c) 2025 NTT InfraNet
'use strict'

// ----------------------------------------------------------------------------

const getenv = require('getenv')
let vars
try {
  vars = {
    EHV_IS_DOCKER_CONTAINER: getenv.bool(
      'EHV_IS_DOCKER_CONTAINER',
      false
    ),
    EHV_PRESERVE_USER_SITES: getenv.bool(
      'EHV_PRESERVE_USER_SITES',
      true
    ),
    RESET_DATABASE: getenv.bool('RESET_DATABASE', false)
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
// in case of breaking change in getenv
Object.keys(vars).forEach(flag => {
  if (typeof vars[flag] !== 'boolean') {
    throw new Error(`${flag} should be boolean!`)
  }
})

// ----------------------------------------------------------------------------

const { deployDb } = require('../lib/test/cloud')

let database_table = []
if (!vars.EHV_IS_DOCKER_CONTAINER) {
  require('dotenv').config({
    path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`
  })
}

async function main() {
  await deployDb(
    {
      flushDb: vars.RESET_DATABASE,
      applyMigrations: true,
      // undoVersion: 'xxx',
      applyFixtures: vars.RESET_DATABASE,
      tables: database_table
    }
  )

  console.log(
    `\x1b[32m\u2714 Database \x1b[1m${process.env.EHV_CORE_MYSQL_DATABASE}\x1b[22m created successfully!\x1b[0m`
  ) // eslint-disable-line no-console
}

main().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
