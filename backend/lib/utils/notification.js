// Copyright (c) 2025 NTT InfraNet
'use strict'

const WebSocketClient = require('websocket').client
const { LOG_INFO } = require('../constants')

const TIMEOUT = 10 * 1000

module.exports = (message, { url, log, timeout }) => {
  // url or siteIdが入力されていない場合はWSSに接続しない
  const siteId = message.siteId
  if (!url || !siteId) {
    return Promise.resolve()
  }
  const data = JSON.stringify(message)

  return new Promise((resolve, reject) => {
    const client = new WebSocketClient()

    let timer = null
    const clear = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    client.on('connectFailed', e => {
      clear()
      reject(e)
    })

    client.on('connect', connection => {
      clear()

      connection.on('error', reject)
      connection.on('close', () => resolve())

      connection.send(JSON.stringify({ action: 'sendmessage', data }), () =>
        connection.close()
      )
    })

    client.connect(url + '&siteId=' + siteId)

    timer = setTimeout(() => {
      log?.info(LOG_INFO + 'WebSocket aborted')
      client.abort()
      clear()
    }, timeout || TIMEOUT)
  })
}
