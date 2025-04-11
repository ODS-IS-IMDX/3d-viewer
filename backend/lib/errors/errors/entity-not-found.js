// Copyright (c) 2025 NTT InfraNet
'use strict'

module.exports = class EntityNotFoundError extends Error {
  constructor(...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EntityNotFoundError)
    }

    this.name = 'EntityNotFound'
  }
}
