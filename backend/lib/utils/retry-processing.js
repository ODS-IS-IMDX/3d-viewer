// Copyright (c) 2025 NTT InfraNet
'use strict'

const { LOG_INFO } = require('../constants')

const RETRY_COUNT = 3
const RETRY_INTERVAL = 3000

const retryProcessing = async (
  targetProcessing = async () => {},
  {
    retryCount = RETRY_COUNT,
    retryInterval = RETRY_INTERVAL,
    logger = log =>
      console.log(LOG_INFO + JSON.stringify(log))
  } = {}
) => {
  for (let i = 1; i <= retryCount; i++) {
    try {
      i > 1 &&
        (await new Promise(resolve => setTimeout(resolve, retryInterval)).catch(
          e =>
            logger({
              type: '[RETRY-PROCESSING-ERROR]',
              stackTrace: e.stack
            })
        ))

      return await targetProcessing()
    } catch (e) {
      if (i >= retryCount) {
        logger({
          type: '[RETRY-PROCESSING-ERROR]',
          stackTrace: e.stack
        })
        throw e
      }
    }
  }
}

module.exports = {
  retryProcessing
}
