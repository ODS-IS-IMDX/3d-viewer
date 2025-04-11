// Copyright (c) 2025 NTT InfraNet
// @flow
import EventEmitter from 'events'
import config from '../../config'
import type { NotificationData } from './types'

class WebSocketService extends EventEmitter {
  _webSocketServerUrl: string = config.datahubWebSocketServerUrl
  _socket: ?WebSocket = null
  siteId: string = ''
  maxRetries = 10
  retryCounts = 0

  _subscribeToEvents (socket: WebSocket) {
    socket.onopen = event => {
      this.retryCounts = 0
    }

    socket.onclose = event => {
      this._socket = null
      this.reconnect()
    }

    socket.onmessage = event => {
      const data: NotificationData = JSON.parse(event.data)
      this.emit('notification', data)
    }
  }

  connect = (siteId: string) => {
    // NOTE: 環境変数未設定の場合は接続しない
    if (!this._webSocketServerUrl) return
    this.siteId = siteId
    this._socket = new WebSocket(
      encodeURI(this._webSocketServerUrl + '&connectionId=' + siteId)
    )
    this._subscribeToEvents(this._socket)
  }

  disconnect = () => {
    if (!this.isConnectionActive()) {
      throw new Error('A connection is not stablished')
    }

    this._socket.close()
  }

  reconnect = () => {
    if (this.isConnectionActive() || !this._webSocketServerUrl) {
      return
    }

    if (this.retryCounts >= this.maxRetries) {
      return
    }

    setTimeout(() => {
      this.retryCounts += 1
      this.connect(this.siteId)
    }, 10000)
  }

  sendMessage = (data: Object) => {
    if (this._socket) {
      const message = {
        action: 'sendmessage',
        data: data
      }
      this._socket.send(JSON.stringify(message))
    }
  }

  isConnectionActive = () => {
    if (!this._socket) return false

    return this._socket.readyState === WebSocket.OPEN
  }
}

export default new WebSocketService()
