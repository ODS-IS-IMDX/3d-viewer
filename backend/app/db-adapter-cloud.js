// Copyright (c) 2025 NTT InfraNet
'use strict'

const fastifyPlugin = require('fastify-plugin')
const credentialsRefresh = require('./db-adapter-cloud-credentials-refresh.js')
const { getDatabaseCredentials } = require('../lib/vault/index.js')
const { LOG_DEBUG, LOG_ERROR } = require('../lib/constants')

async function cloudDbAdapter(fastify) {
  const config = fastify.config.dbAdapter.cloud
  if (config.vault && config.vault.dbCredentialsRefresh) {
    await getDatabaseCredentials(config.vault, config)
  }

  fastify.log.info(
    LOG_DEBUG +
      `Mysql try to connect: mysql://${config.user}:XXXXXXX@${config.host}:${config.port}/${config.database}`
  )

  fastify
    .register(require('@fastify/mysql'), {
      promise: true,
      connectionString: `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`
    })
    .after(err => {
      if (err) {
        fastify.log.error(LOG_ERROR + JSON.stringify(err))
        process.exit(1)
      }
      fastify.log.info(
        LOG_DEBUG +
          `Mysql connection established with: mysql://${config.user}:XXXXXXX@${config.host}:${config.port}/${config.database}`
      )

      if (config.vault && config.vault.dbCredentialsRefresh) {
        fastify
          .register(credentialsRefresh, {
            vault: config.vault,
            interval: config.vault.dbCredentialsRefresh
          })
          .after(err => {
            if (err) {
              fastify.log.error(LOG_ERROR + JSON.stringify(err))
              process.exit(1)
            }
          })
      }

      fastify.decorate('dbAdapters', {
        liveness: new (require('./liveness/db/cloud'))({
          mysql: fastify.mysql,
          log: fastify.log,
          fastify
        }),
        sites: new (require('./sites/db/cloud'))({
          mysql: fastify.mysql,
          log: fastify.log,
          fastify
        }),
        users: new (require('./users/db/cloud'))({
          mysql: fastify.mysql,
          log: fastify.log,
          fastify
        }),
        corporations: new (require('./corporations/db/cloud'))({
          mysql: fastify.mysql,
          log: fastify.log,
          fastify
        }),
        assets: new (require('./assets/db/cloud'))({
          mysql: fastify.mysql,
          log: fastify.log,
          fastify
        }),
        assetsAssets: new (require('./assets-assets/db/cloud'))({
          mysql: fastify.mysql,
          log: fastify.log,
          fastify
        }),
        processingStatusManagements: new (require('./processing-status-managements/db/cloud'))(
          {
            mysql: fastify.mysql,
            log: fastify.log,
            fastify
          }
        )
      })
    })
}

module.exports = fastifyPlugin(cloudDbAdapter)
