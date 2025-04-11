// Copyright (c) 2025 NTT InfraNet
'use strict'

module.exports = class MethodNotImplementedError extends Error {
  constructor(...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MethodNotImplementedError)
    }

    this.name = 'MethodNotImplemented'
  }
}
