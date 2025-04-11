// Copyright (c) 2025 NTT InfraNet
const { getDatabaseCredentials } = require('../lib/vault/index.js')
const { LOG_DEBUG } = require('../lib/constants')

const RETRY_COUNT = 3
const DELAY_MS = 1000

module.exports = (fastify, options, next) => {
  setInterval(async () => {
    if (fastify.mysql) {
      let isRefresh = false
      for (let i = 0; i < RETRY_COUNT; i++) {
        const res = await getDatabaseCredentials(
          options.vault,
          fastify.mysql.pool.pool.config.connectionConfig
        ).catch(e => {
          fastify.log.error(LOG_DEBUG + JSON.stringify(e))
        })

        if (res) {
          isRefresh = true
          break
        }

        await new Promise(resolve => setTimeout(resolve, DELAY_MS))
      }
      if (!isRefresh) {
        process.exit(1)
      }
    }
  }, options.interval)
  next()
}
