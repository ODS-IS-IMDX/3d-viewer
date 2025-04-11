// Copyright (c) 2025 NTT InfraNet
'use strict'

const RESPONSE_HEADER_LIST = [
  {
    key: 'X-XSS-Protection',
    val: '1; mode=block',
    excludeApi: []
  },
  {
    key: 'Cache-Control',
    val: 'no-cache, no-store',
    excludeApi: []
  },
  {
    key: 'Pragma',
    val: 'no-cache',
    excludeApi: []
  },
  {
    key: 'Expires',
    val: '0',
    excludeApi: []
  }
]

const setResponseHeaders = (operationId, reply) => {
  RESPONSE_HEADER_LIST.forEach(h => {
    if (!h.excludeApi.includes(operationId)) {
      reply.header(h.key, h.val)
    }
  })
}

module.exports = {
  setResponseHeaders
}
