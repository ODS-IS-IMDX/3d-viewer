// Copyright (c) 2025 NTT InfraNet
'use strict'

module.exports = class DbAdapterFileNotFoundError extends Error {
  constructor(...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DbAdapterFileNotFoundError)
    }

    this.name = 'DbAdapterFileNotFound'
  }
}
