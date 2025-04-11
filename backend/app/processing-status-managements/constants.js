// Copyright (c) 2025 NTT InfraNet
const PROCESSING_TYPE = {
  ASSET_CREATE: 'asset_create'
}

const PROCESSING_STATUS = {
  PROCESSING: 'processing'
}

const RESOURCE_CATEGORY = {
  ALL: 'all',
  SITE: 'site',
  KEYWORD: 'keyword'
}

const RESOURCE_INFO = {
  [RESOURCE_CATEGORY.ALL]: {
    referenceId: null,
    default: 'all'
  },
  [RESOURCE_CATEGORY.SITE]: {
    referenceId: 'siteId',
    default: null
  },
  [RESOURCE_CATEGORY.KEYWORD]: {
    referenceId: null,
    default: null
  }
}

module.exports = {
  PROCESSING_TYPE,
  PROCESSING_STATUS,
  RESOURCE_CATEGORY,
  RESOURCE_INFO
}
