// Copyright (c) 2025 NTT InfraNet
'use strict'

const Boom = require('@hapi/boom')
const { EntityNotFoundError, GenericServerError } = require('../errors')

const _setErrorMessageCode = ({
  errorObj,
  statusCode,
  errorCode,
  getErrorMessageCode
}) => {
  const errorMessageCode =
    typeof getErrorMessageCode === 'function'
      ? getErrorMessageCode({ statusCode, errorCode })
      : ''

  if (errorMessageCode && errorObj && errorObj.isBoom) {
    errorObj.output.payload.messageCode = errorMessageCode
  }
}

module.exports.generateBoomObj = ({
  errorObj = null,
  errorInfo = {},
  getErrorMessageCode
}) => {
  const { statusCode: baseStatusCode, error: { error_code: errorCode } = {} } =
    errorObj || errorInfo

  if (errorObj && errorObj.isBoom) {
    _setErrorMessageCode({
      errorObj,
      statusCode: baseStatusCode || errorObj.output.statusCode,
      errorCode,
      getErrorMessageCode
    })

    return errorObj
  }

  const statusCode =
    baseStatusCode ||
    (e => {
      switch (true) {
        case e instanceof EntityNotFoundError:
          return 404
        case e instanceof GenericServerError:
        default:
          return 500
      }
    })(errorObj)

  const boomObj = errorObj
    ? Boom.boomify(errorObj, { statusCode })
    : new Boom.Boom(errorCode, { statusCode })

  _setErrorMessageCode({
    errorObj: boomObj,
    statusCode,
    errorCode,
    getErrorMessageCode
  })

  return boomObj
}
