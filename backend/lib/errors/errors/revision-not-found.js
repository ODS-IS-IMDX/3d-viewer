// Copyright (c) 2025 NTT InfraNet
'use strict'

module.exports = class RevisionNotFoundError extends Error {
  constructor(...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RevisionNotFoundError)
    }

    this.name = 'RevisionNotFound'
  }
}
