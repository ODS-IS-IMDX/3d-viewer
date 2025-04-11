// Copyright (c) 2025 NTT InfraNet
module.exports = {
  EntityDuplicationError: require('./errors/entity-duplication'),
  EntityNotFoundError: require('./errors/entity-not-found'),
  GenericServerError: require('./errors/generic-server'),
  MethodNotImplementedError: require('./errors/method-not-implemented'),
  DbAdapterFileNotFoundError: require('./errors/db-adapter-file-not-found'),
  RevisionNotFoundError: require('./errors/revision-not-found')
}
